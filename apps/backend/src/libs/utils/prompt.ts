import { z } from 'zod';
import { InterviewContentSchema } from '@repo/schema/interview';
import config from '@/config';
const GROK_API_KEY = config.grok.apiKey;
import { INTERVIEW_CHAT_LIMIT } from '@/libs/constant';
import { ResultScoresSchema, ResultContentsFeedbackSchema, ResultFeedbackSchema } from '@repo/schema/result';


type InterviewContent = z.infer<typeof InterviewContentSchema>;

const ScoreResultSchema = z.object({
  scores: ResultScoresSchema,
});

const ContentFeedbackResultSchema = z.object({
  feedback: ResultContentsFeedbackSchema,
});

const FeedbackResultSchema = ResultFeedbackSchema;

export type Interviewer = {
  persona: {
    mbti: string;
    style: string;
    focus: string;
  };
}

type XAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

type XAIRequestConfig = {
  model: string;
  messages: XAIMessage[];
}

type XAIResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const xAIRequest = async (config: XAIRequestConfig, retries: number = 3, delay: number = 1000): Promise<XAIResponse> => {
  if (!GROK_API_KEY) {
    throw new Error('GROK_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        if (response.status === 429 && i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`API 호출 실패: ${response.status} ${response.statusText}, URL: https://api.x.ai/v1/chat/completions`);
      }

      const data: XAIResponse = await response.json() as XAIResponse;
      return data;
    } catch (err) {
      console.log('err', err);
      if (i === retries - 1) {
        throw new Error(`API 호출 실패: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  throw new Error('API 호출 실패: 최대 재시도 횟수 초과');
};

export const getSystemPromptByPersona = (interviewer: Interviewer): string => {
  const { persona } = interviewer;
  return `당신은 ${persona.mbti} 성격을 가진 면접관입니다.  
    질문을 ${persona.style} 스타일로 진행하며, ${persona.focus}에 초점을 맞춰 주세요.  
    질문을 한국어로 간결하게 작성하고, 답변은 3문장 이내로 지시하세요.`;
};

export const getAiMessageFormat = (contents: InterviewContent[]): XAIMessage[] => {
  if (!contents || !Array.isArray(contents)) return [];
  return contents.map(item => ({
    role: item.speaker === 'user' ? 'user' : 'assistant',
    content: item.content,
  }));
}

export const checkNextQuestionRelated = async (contents: InterviewContent[]): Promise<boolean> => {
  if (!contents || contents.length === 0) return false;
  const messages = getAiMessageFormat(contents).slice(-5); // 비용 최적화: 최근 5개 메시지
  const config: XAIRequestConfig = {
    model: 'grok-3-beta',
    messages: [
      ...messages,
      {
        role: 'system',
        content: '다음 질문이 이전 주제와 관련 있어야 하면 "y", 그렇지 않으면 "n"을 반환하세요.',
      },
    ],
  };
  const response = await xAIRequest(config);
  return response.choices[0]?.message?.content === 'y' || false;
}

export const askQuestion = async (
  interviewer: Interviewer,
  contents: InterviewContent[],
  isRelated: boolean
): Promise<string> => {
  const systemPrompt = getSystemPromptByPersona(interviewer);
  const messages = getAiMessageFormat(contents).slice(-10); // 비용 최적화: 최근 10개 메시지
  const prompt = isRelated ? '이전 질문과 관련된 심화된 질문을 진행하세요.' : '새로운 주제로 질문을 진행하세요.';
  const config: XAIRequestConfig = {
    model: 'grok-3-beta',
    messages: [
      { role: 'system', content: systemPrompt + '\n응답은 정확하고 자연스러운 한국어로 작성하세요.' },
      ...messages,
      { role: 'user', content: prompt },
    ],
  };
  const response = await xAIRequest(config);
  return response.choices[0]?.message?.content || '질문 생성 실패';
}

export const generateEvaluation = async (contents: InterviewContent[]): Promise<{
  success: boolean;
  scores: Array<{ standard: string; score: number; summary: string }>;
  contentFeedback: Array<{ question: string; feedback: string }>;
  feedback: string;
}> => {
  const messages = getAiMessageFormat(contents).slice(0, INTERVIEW_CHAT_LIMIT);

  try {
    const scoreConfig: XAIRequestConfig = {
      model: 'grok-beta',
      messages: [
        ...messages,
        {
          role: 'system',
          content: `면접을 다음 기준으로 평가하세요:
          1. 기술적 전문성
          2. 문제 해결 능력
          3. 의사소통
          4. 적응력
          5. 팀워크
          JSON 형식으로 반환: { "scores": [{ "standard": string, "score": number (1-100), "summary": string }] }.
          응답은 정확하고 자연스러운 한국어로 작성하세요.
        `,
        },
      ],
    };

    const scoreResponse = await xAIRequest(scoreConfig);

    // 각 질문에 대한 피드백
    const contentFeedbackConfig: XAIRequestConfig = {
      model: 'grok-beta',
      messages: [
        ...messages,
        {
          role: 'system',
          content: `각 면접 질문에 대해 간단한 피드백을 제공하세요. 한국어로 1-2문장으로 작성하고, JSON 배열로 반환: { "feedback": [{ "question": string, "feedback": string, "score": number (1-100) }] }.
          응답은 정확하고 자연스러운 한국어로 작성하세요.
        `,
        },
      ],
    };

    const contentFeedbackResponse = await xAIRequest(contentFeedbackConfig);

    // 전체 피드백
    const feedbackConfig: XAIRequestConfig = {
      model: 'grok-beta',
      messages: [
        ...messages,
        {
          role: 'system',
          content: '면접 성과를 요약하는 피드백을 한국어로 3문장 이상 작성하세요. 응답은 정확하고 자연스러운 한국어로 작성하세요.',
        },
      ],
    };

    const feedbackResponse = await xAIRequest(feedbackConfig);

    const scoresResult = ScoreResultSchema.safeParse(JSON.parse(
      scoreResponse.choices[0]?.message?.content?.replace(/```json\n|\n```/g, '') || '{}'
    ));
    const contentFeedbackResult = ContentFeedbackResultSchema.safeParse(JSON.parse(
      contentFeedbackResponse.choices[0]?.message?.content?.replace(/```json\n|\n```/g, '') || '{}'
    ));
    const feedbackResult = FeedbackResultSchema.safeParse(
      feedbackResponse.choices[0]?.message?.content
    );

    if (!scoresResult.success || !contentFeedbackResult.success || !feedbackResult.success) {
      return {
        success: false,
        scores: [],
        contentFeedback: [],
        feedback: '',
      };
    }

    return {
      success: true,
      scores: scoresResult.data.scores,
      contentFeedback: contentFeedbackResult.data.feedback,
      feedback: feedbackResult.data,
    };
  } catch (error) {
    console.log('error', error);

    return {
      success: false,
      scores: [],
      contentFeedback: [],
      feedback: '',
    };
  }
}

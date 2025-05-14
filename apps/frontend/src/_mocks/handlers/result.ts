import { http, HttpResponse, delay } from 'msw';
import {
  CreateResultRequestSchema,
  CreateResultResponseSchema,
  GetResultRequestSchema,
  GetResultResponseSchema,
  ResultScoresSchema,
  ResultContentsFeedbackSchema,
  ResultFeedbackSchema,
} from '@repo/schema/result';
import { InterviewSchema } from '@repo/schema/interview';
import { UserSchema } from '@repo/schema/user';
import { InterviewerSchema } from '@repo/schema/interviewer';
import { baseURL } from '@/_apis/fetcher';
import { DEFAULT_PROFILE_IMAGE_URL } from '@repo/constant/name';

const CREATE_RESULT_PATH = `${baseURL}/result`;
const GET_RESULT_PATH = `${baseURL}/result/:id`;

const results: Array<ReturnType<typeof GetResultResponseSchema.parse>> = [];

let resultIdCounter = 1;

const tempMockInterviewsForResults: Record<number, ReturnType<typeof InterviewSchema.parse>> = {
  1: InterviewSchema.parse({
    id: 1,
    interviewerId: 1,
    userId: 1,
    user: UserSchema.parse({
      id: 1,
      email: 'user@example.com',
      name: 'Mock User',
      profileImageUrl: DEFAULT_PROFILE_IMAGE_URL,
    }),
    interviewer: InterviewerSchema.parse({
      id: 1,
      name: '박보영',
      persona: { mbti: 'ENFJ', style: '밝고 다정함', focus: '소통, 공감' },
      profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ENFJ.png',
      description:
        '박보영은 밝고 다정한 성격을 지녔습니다. ENFJ 성격을 살려 따뜻한 면접 분위기를 조성하며, 소통과 팀워크를 중시하는 질문을 제시합니다.',
    }),
    category: '기술 면접',
    contents: [
      { id: 1, content: '자기소개 부탁드립니다.', speaker: 'interviewer', createdAt: new Date() },
      { id: 2, content: '네 안녕하세요. 저는 Mock User 입니다.', speaker: 'user', createdAt: new Date() },
    ],
    status: 'completed',
  }),
};

export const resultHandlers = [
  // 결과 생성
  http.post(CREATE_RESULT_PATH, async ({ request }) => {
    const body = await request.json();
    const validation = CreateResultRequestSchema.safeParse(body);

    if (!validation.success) {
      return HttpResponse.json(
        { message: '입력값이 유효하지 않습니다.', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { interviewId } = validation.data;

    if (results.some(r => r.interviewId === interviewId)) {
      const existingResult = results.find(r => r.interviewId === interviewId);

      if (!existingResult) {
        return HttpResponse.json({ message: '결과를 찾을 수 없습니다.' }, { status: 404 });
      }

      return HttpResponse.json(CreateResultResponseSchema.parse({ id: existingResult.id }), { status: 200 });
    }

    const interview = tempMockInterviewsForResults[interviewId];

    if (!interview) {
      return HttpResponse.json({ message: '인터뷰를 찾을 수 없습니다.' }, { status: 404 });
    }

    const scores = ResultScoresSchema.parse([
      {
        standard: '기술 이해도',
        score: Math.floor(Math.random() * 5) + 1,
        summary: '관련 기술에 대한 이해도가 보통입니다.',
      },
      {
        standard: '문제 해결 능력',
        score: Math.floor(Math.random() * 5) + 1,
        summary: '주어진 문제에 대해 논리적으로 접근합니다.',
      },
      {
        standard: '커뮤니케이션',
        score: Math.floor(Math.random() * 5) + 1,
        summary: '자신의 생각을 명확하게 전달하는 편입니다.',
      },
    ]);

    const contentFeedback = ResultContentsFeedbackSchema.parse(
      (interview.contents || [])
        .filter(c => c.speaker === 'user')
        .map((c, index) => ({
          question: `질문 ${index + 1}: ${(interview.contents || []).find(q => q.speaker === 'interviewer' && q.id < c.id)?.content || '관련 질문'}`,
          feedback: `답변 ${index + 1}에 대한 피드백입니다. 조금 더 구체적인 예시를 들면 좋겠습니다.`,
        }))
    );

    const feedback = ResultFeedbackSchema.parse(
      '전반적으로 좋은 모습을 보여주셨습니다. 특히 커뮤니케이션 부분이 인상적이었습니다. 다만, 문제 해결 능력 부분은 조금 더 보완하시면 좋을 것 같습니다.'
    );

    const newResultId = resultIdCounter++;
    const newResult = GetResultResponseSchema.parse({
      id: newResultId,
      interviewId: interview.id,
      interview: interview,
      interviewerId: interview.interviewerId,
      interviewer: interview.interviewer,
      userId: interview.userId,
      user: interview.user,
      scores,
      contentFeedback,
      feedback,
    });

    results.push(newResult);
    await delay(1000);

    return HttpResponse.json(CreateResultResponseSchema.parse({ id: newResult.id }), { status: 201 });
  }),

  // 결과 상세 조회
  http.get(GET_RESULT_PATH, async ({ params }) => {
    const { id } = params;
    const resultId = parseInt(id as string, 10);

    const validation = GetResultRequestSchema.safeParse({ id: resultId });
    if (!validation.success) {
      return HttpResponse.json(
        { message: '결과 ID가 유효하지 않습니다.', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await delay(300);
    const result = results.find(r => r.id === resultId);

    if (!result) {
      return HttpResponse.json({ message: '결과를 찾을 수 없습니다.' }, { status: 404 });
    }

    return HttpResponse.json(result);
  }),
];

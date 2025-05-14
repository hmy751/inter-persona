import { http, HttpResponse, delay } from 'msw';
import { UserSchema } from '@repo/schema/user';
import { InterviewerSchema } from '@repo/schema/interviewer';
import {
  InterviewSchema,
  InterviewContentSchema,
  InterviewResponseSchema,
  InterviewCreateRequestSchema,
  InterviewCreateResponseSchema,
  InterviewContentsResponseSchema,
  InterviewStartResponseSchema,
  InterviewAnswerRequestSchema,
  InterviewAnswerResponseSchema,
  InterviewStatusResponseSchema,
  InterviewInterviewerResponseSchema,
  InterviewUserResponseSchema,
} from '@repo/schema/interview';
import { baseURL } from '@/_apis/fetcher';
import { DEFAULT_PROFILE_IMAGE_URL } from '@repo/constant/name';

const CREATE_INTERVIEW_PATH = `${baseURL}/interview`;
const GET_INTERVIEW_PATH = `${baseURL}/interview/:id`;
const GET_INTERVIEW_CONTENTS_PATH = `${baseURL}/interview/:id/contents`;
const START_INTERVIEW_PATH = `${baseURL}/interview/:id/start`;
const SUBMIT_ANSWER_PATH = `${baseURL}/interview/:id/contents/answer`;
const GET_INTERVIEW_STATUS_PATH = `${baseURL}/interview/:id/status`;
const GET_INTERVIEW_INTERVIEWER_PATH = `${baseURL}/interview/:id/interviewer`;
const GET_INTERVIEW_USER_PATH = `${baseURL}/interview/:id/user`;

const mockUsers: Record<number, ReturnType<typeof UserSchema.parse>> = {
  1: UserSchema.parse({
    id: 1,
    email: 'user@example.com',
    name: 'Mock User',
    profileImageUrl: DEFAULT_PROFILE_IMAGE_URL,
  }),
};

const mockInterviewers: Record<number, ReturnType<typeof InterviewerSchema.parse>> = {
  1: InterviewerSchema.parse({
    id: 1,
    name: '제프 배조스',
    persona: { mbti: 'ISTJ', style: '체계적이고 조직적', focus: '체계적, 구체적' },
    profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ISTJ.png',
    description:
      '제프 배조스는 체계적이고 조직적인 스타일을 갖췄습니다. ISTJ 성격답게 꼼꼼하고 논리적인 질문을 통해 지원자의 세부 사항을 집중적으로 살펴봅니다.',
  }),
  2: InterviewerSchema.parse({
    id: 2,
    name: '박보영',
    persona: { mbti: 'ENFJ', style: '밝고 다정함', focus: '소통, 공감' },
    profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ENFJ.png',
    description:
      '박보영은 밝고 다정한 성격을 지녔습니다. ENFJ 성격을 살려 따뜻한 면접 분위기를 조성하며, 소통과 팀워크를 중시하는 질문을 제시합니다.',
  }),
};

const interviews: Array<ReturnType<typeof InterviewSchema.parse>> = [];

let interviewIdCounter = 1;
let contentIdCounter = 1;

const getNextInterviewerResponse = (questionNumber: number): string => {
  const commonFollowUp = [
    '그 경험에 대해 좀 더 자세히 말씀해주시겠어요?',
    '만약 다른 상황이었다면 어떻게 접근했을 것 같나요?',
    '그 프로젝트에서 가장 어려웠던 점은 무엇이었고, 어떻게 해결하셨나요?',
    '팀원들과의 협업은 어떠셨나요? 갈등이 있었다면 어떻게 해결하셨는지 궁금합니다.',
    '그 기술을 선택하신 특별한 이유가 있나요? 다른 대안은 고려해보셨는지요?',
    '마지막으로 하고 싶으신 말씀이 있으신가요?',
  ] as const;

  if (questionNumber >= 5) {
    return commonFollowUp[5];
  }
  return commonFollowUp[Math.floor(Math.random() * (commonFollowUp.length - 1))] as string;
};

export const interviewHandlers = [
  // 인터뷰 생성
  http.post(CREATE_INTERVIEW_PATH, async ({ request }) => {
    const body = await request.json();
    const validation = InterviewCreateRequestSchema.safeParse(body);

    if (!validation.success) {
      return HttpResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { interviewerId, userId, category } = validation.data;
    const user = mockUsers[userId];
    const interviewer = mockInterviewers[interviewerId];

    if (!user || !interviewer) {
      return HttpResponse.json({ message: 'User or Interviewer not found' }, { status: 404 });
    }

    const newInterviewData = {
      id: interviewIdCounter++,
      interviewerId,
      userId,
      user: user,
      interviewer: interviewer,
      category: category,
      contents: [],
      status: 'ongoing' as 'ongoing' | 'completed',
    } as const;

    const parsedInterview = InterviewSchema.parse(newInterviewData);
    interviews.push(parsedInterview);

    await delay(500);

    const responseData = InterviewCreateResponseSchema.parse({ interviewId: parsedInterview.id });
    return HttpResponse.json(responseData, { status: 201 });
  }),

  // 인터뷰 상세 조회
  http.get(GET_INTERVIEW_PATH, async ({ params }) => {
    const { id } = params;
    const interviewId = parseInt(id as string, 10);
    const interview = interviews.find(i => i.id === interviewId);

    await delay(300);

    if (!interview) {
      return HttpResponse.json({ message: '인터뷰를 찾을 수 없습니다.' }, { status: 404 });
    }

    const responseData = InterviewResponseSchema.parse(interview);
    return HttpResponse.json(responseData);
  }),

  // 인터뷰 대화 내용 조회
  http.get(GET_INTERVIEW_CONTENTS_PATH, async ({ params }) => {
    const { id } = params;
    const interviewId = parseInt(id as string, 10);
    const interview = interviews.find(i => i.id === interviewId);

    await delay(300);

    if (!interview) {
      return HttpResponse.json({ message: '인터뷰를 찾을 수 없습니다.' }, { status: 404 });
    }
    const responseData = InterviewContentsResponseSchema.parse({ contents: interview.contents || [] });
    return HttpResponse.json(responseData);
  }),

  // 인터뷰 시작 (첫 질문)
  http.post(START_INTERVIEW_PATH, async ({ params }) => {
    const { id } = params;
    const interviewId = parseInt(id as string, 10);
    const interview = interviews.find(i => i.id === interviewId);

    await delay(300);

    if (!interview) {
      return HttpResponse.json({ message: '인터뷰를 찾을 수 없습니다.' }, { status: 404 });
    }

    const existingInterviewerContent = (interview.contents || []).find(c => c.speaker === 'interviewer');

    if (existingInterviewerContent) {
      const responseData = InterviewStartResponseSchema.parse({
        content: existingInterviewerContent.content,
        speaker: 'interviewer',
      });
      return HttpResponse.json(responseData);
    }

    const firstQuestionContent = '안녕하세요, 면접을 시작하겠습니다. 먼저 간단한 자기소개 부탁드립니다.';
    const newContent = InterviewContentSchema.parse({
      id: contentIdCounter++,
      content: firstQuestionContent,
      speaker: 'interviewer',
      createdAt: new Date(),
    });
    interview.contents = [...(interview.contents || []), newContent];

    const responseData = InterviewStartResponseSchema.parse({ content: newContent.content, speaker: 'interviewer' });
    return HttpResponse.json(responseData);
  }),

  // 사용자 답변 제출 및 다음 질문 받기
  http.post(SUBMIT_ANSWER_PATH, async ({ request, params }) => {
    const { id } = params;
    const interviewId = parseInt(id as string, 10);
    const body = await request.json();

    const validation = InterviewAnswerRequestSchema.safeParse({
      interviewId,
      content: (body as { content: string }).content,
    });

    if (!validation.success) {
      return HttpResponse.json(
        { message: 'Invalid input for answer', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const interview = interviews.find(i => i.id === interviewId);

    if (!interview || interview.status === 'completed') {
      return HttpResponse.json({ message: '인터뷰를 찾을 수 없거나 이미 완료되었습니다.' }, { status: 404 });
    }

    const userAnswer = InterviewContentSchema.parse({
      id: contentIdCounter++,
      content: validation.data.content,
      speaker: 'user',
      createdAt: new Date(),
    });
    interview.contents = [...(interview.contents || []), userAnswer];

    await delay(700);

    const interviewerQuestionCount = (interview.contents || []).filter(c => c.speaker === 'interviewer').length;
    const nextQuestionContent = getNextInterviewerResponse(interviewerQuestionCount);

    const interviewerResponse = InterviewContentSchema.parse({
      id: contentIdCounter++,
      content: nextQuestionContent,
      speaker: 'interviewer',
      createdAt: new Date(),
    });
    interview.contents.push(interviewerResponse);

    if (interviewerQuestionCount + 1 >= 5) {
      interview.status = 'completed';
    }

    return HttpResponse.json(
      InterviewAnswerResponseSchema.parse({ content: interviewerResponse.content, speaker: 'interviewer' })
    );
  }),

  // 인터뷰 상태 조회
  http.get(GET_INTERVIEW_STATUS_PATH, async ({ params }) => {
    const { id } = params;
    const interviewId = parseInt(id as string, 10);
    const interview = interviews.find(i => i.id === interviewId);

    await delay(200);

    if (!interview) {
      return HttpResponse.json({ message: '인터뷰를 찾을 수 없습니다.' }, { status: 404 });
    }

    const responseData = InterviewStatusResponseSchema.parse({ status: interview.status });
    return HttpResponse.json(responseData);
  }),

  // 인터뷰의 면접관 정보 조회
  http.get(GET_INTERVIEW_INTERVIEWER_PATH, async ({ params }) => {
    const { id } = params;
    const interviewId = parseInt(id as string, 10);
    const interview = interviews.find(i => i.id === interviewId);

    await delay(200);

    if (!interview || !interview.interviewer) {
      return HttpResponse.json({ message: '면접관 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    const responseData = InterviewInterviewerResponseSchema.parse({ interviewer: interview.interviewer });
    return HttpResponse.json(responseData);
  }),

  // 인터뷰의 사용자 정보 조회
  http.get(GET_INTERVIEW_USER_PATH, async ({ params }) => {
    const { id } = params;
    const interviewId = parseInt(id as string, 10);
    const interview = interviews.find(i => i.id === interviewId);

    await delay(200);

    if (!interview || !interview.user) {
      return HttpResponse.json({ message: '사용자 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    const responseData = InterviewUserResponseSchema.parse({ user: interview.user });
    return HttpResponse.json(responseData);
  }),
];

import { http, HttpResponse, delay } from 'msw';
import { InterviewerSchema, InterviewerResponseSchema, InterviewerListResponseSchema } from '@repo/schema/interviewer';
import { baseURL } from '@/_apis/fetcher';

const INTERVIEWER_LIST_API_PATH = `${baseURL}/interviewer`;
const INTERVIEWER_DETAIL_API_PATH = `${baseURL}/interviewer/:id`;

const interviewersData = [
  InterviewerSchema.parse({
    id: 1,
    name: '제프 배조스',
    persona: { mbti: 'ISTJ', style: '체계적이고 조직적', focus: '체계적, 구체적' },
    profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ISTJ.png',
    description:
      '제프 배조스는 체계적이고 조직적인 스타일을 갖췄습니다. ISTJ 성격답게 꼼꼼하고 논리적인 질문을 통해 지원자의 세부 사항을 집중적으로 살펴봅니다.',
  }),
  InterviewerSchema.parse({
    id: 2,
    name: '박보영',
    persona: { mbti: 'ENFJ', style: '밝고 다정함', focus: '소통, 공감' },
    profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ENFJ.png',
    description:
      '박보영은 밝고 다정한 성격을 지녔습니다. ENFJ 성격을 살려 따뜻한 면접 분위기를 조성하며, 소통과 팀워크를 중시하는 질문을 제시합니다.',
  }),
];

export const interviewerHandlers = [
  // 면접관 목록 조회
  http.get(INTERVIEWER_LIST_API_PATH, async () => {
    await delay(300);
    const responseData = InterviewerListResponseSchema.parse(interviewersData);
    return HttpResponse.json(responseData);
  }),

  // 특정 면접관 상세 조회
  http.get(INTERVIEWER_DETAIL_API_PATH, async ({ params }) => {
    const { id } = params;
    const interviewerId = parseInt(id as string, 10);

    await delay(300);

    const interviewer = interviewersData.find(i => i.id === interviewerId);

    if (!interviewer) {
      return HttpResponse.json({ message: '면접관을 찾을 수 없습니다.' }, { status: 404 });
    }

    const responseData = InterviewerResponseSchema.parse(interviewer);
    return HttpResponse.json(responseData);
  }),
];

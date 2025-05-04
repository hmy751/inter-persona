import { http, HttpResponse, RequestHandler } from 'msw';
import { baseURL } from '@/_apis/fetcher';
import {
  GetInterviewBody,
  AnswerBody,
  GetInterviewInterviewerBody,
  GetInterviewUserBody,
  CreateInterviewBody,
} from '@/_apis/interview';

const defaultInterviewHandler = [
  http.post<never, CreateInterviewBody>(`${baseURL}/interview`, async ({ request }) => {
    const { interviewerId, userId } = await request.json();
    return HttpResponse.json({
      id: 1,
    });
  }),
  http.get<never, GetInterviewBody>(`${baseURL}/interview/:interviewId`, async ({ params }) => {
    const { interviewId } = params;
    return HttpResponse.json({
      id: Number(interviewId),
      interviewerId: 1,
      userId: 1,
    });
  }),
  http.get<never, GetInterviewInterviewerBody>(`${baseURL}/interview/:interviewId/interviewer`, async ({ params }) => {
    const { interviewId } = params;
    return HttpResponse.json({
      interviewer: {
        id: 1,
        imgUrl: '/images/ENFP.webp',
        name: '민지',
        mbti: 'ENFP',
        description:
          '이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.',
      },
    });
  }),
  http.get<never, GetInterviewUserBody>(`${baseURL}/interview/:interviewId/user`, async ({ params }) => {
    const { interviewId } = params;
    return HttpResponse.json({
      user: {
        id: 1,
        imgUrl: '/assets/images/dev_profile.png',
        name: '민지',
      },
    });
  }),
  http.post<never, AnswerBody>(`${baseURL}/interview/:interviewId/contents/answer`, async ({ request }) => {
    const { interviewId, content } = await request.json();
    return HttpResponse.json({
      content: '자바스크립트의 클로저에 대해 설명해주세요',
    });
  }),
];

const interviewHandlerforInterviewerError = [
  http.post<never, AnswerBody>(`${baseURL}/interview/:interviewId/contents/answer`, async ({ request }) => {
    const { interviewId, content } = await request.json();
    console.log('pass');

    const random = Math.random();

    if (random > 0.5) {
      return HttpResponse.json({
        content: '자바스크립트의 클로저에 대해 설명해주세요',
      });
    }

    return HttpResponse.json({
      content: null,
    });
  }),
  http.post('/interview', async ({ request }) => {
    try {
      const formData = await request.formData();
      return HttpResponse.json({
        text: '잘 모르겠습니다.',
      });
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to process audio' }, { status: 400 });
    }
  }),
];

const interviewHandler: RequestHandler[] = [...defaultInterviewHandler];

export default interviewHandler;

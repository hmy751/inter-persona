import { http, HttpResponse, RequestHandler } from "msw";
import { baseURL } from "@/_apis/fetcher";
import { InterviewBody, AnswerBody } from "@/_apis/interview";

const defaultInterviewHandler = [
  http.post<never, InterviewBody>(
    `${baseURL}/interview`,
    async ({ request }) => {
      const { interviewerId, reviewerId } = await request.json();
      return HttpResponse.json({
        id: 1,
      });
    }
  ),
  http.post<never, AnswerBody>(
    `${baseURL}/interview/:chatId/contents`,
    async ({ request }) => {
      const { interviewId, content } = await request.json();
      return HttpResponse.json({
        content: "자바스크립트의 클로저에 대해 설명해주세요",
      });
    }
  ),
];

const interviewHandlerforInterviewerError = [
  http.post<never, AnswerBody>(
    `${baseURL}/interview/:chatId/contents`,
    async ({ request }) => {
      const { interviewId, content } = await request.json();
      console.log('pass')

      const random = Math.random();

      if (random > 0.5) {
        return HttpResponse.json({
          content: "자바스크립트의 클로저에 대해 설명해주세요",
        });
      }

      return HttpResponse.json({
        content: null,
      });
    }
  ),
  http.post('/interview', async ({ request }) => {
    try {
      const formData = await request.formData();
      return HttpResponse.json({
        text: "잘 모르겠습니다.",
      });
    } catch (error) {
      return HttpResponse.json(
        { error: "Failed to process audio" },
        { status: 400 }
      );
    }
  }),
];

const interviewHandler: RequestHandler[] = [...defaultInterviewHandler];

export default interviewHandler;
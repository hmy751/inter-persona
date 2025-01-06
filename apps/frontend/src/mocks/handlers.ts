import { http, HttpResponse, RequestHandler } from "msw";
import { baseURL } from "@/apis/fetcher";
import { LoginBody } from "@/apis/user";

import { InterviewBody, AIChatBody } from "@/apis/interview";

const userHandler = [
  http.post<never, LoginBody>(`${baseURL}/login`, async ({ request }) => {
    const { name } = await request.json();
    return HttpResponse.json({
      id: 1,
      name,
      imageSrc: "/assets/images/dev_profile.png",
    });
  }),
];

const interviewHandler = [
  http.post<never, InterviewBody>(
    `${baseURL}/interview`,
    async ({ request }) => {
      const { interviewerId, reviewerId } = await request.json();
      return HttpResponse.json({
        id: 1,
      });
    }
  ),
  http.post<never, AIChatBody>(
    `${baseURL}/interview/:chatId/contents`,
    async ({ request }) => {
      const { chatId, content } = await request.json();
      return HttpResponse.json({
        content: "자바스크립트의 클로저에 대해 설명해주세요",
      });
    }
  ),
];

const handlers: RequestHandler[] = [...userHandler, ...interviewHandler];

export default handlers;

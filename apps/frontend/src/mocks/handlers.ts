import { http, HttpResponse, RequestHandler } from "msw";

import { baseURL } from "@/apis";
import { LoginBody } from "@/apis/user";

import { InterviewBody } from "@/apis/interview";

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
];

const handlers: RequestHandler[] = [...userHandler, ...interviewHandler];

export default handlers;

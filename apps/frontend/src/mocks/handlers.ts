import { http, HttpResponse, RequestHandler } from "msw";

import { baseURL } from "@/apis";
import { LoginBody } from "@/apis/user";

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

const handlers: RequestHandler[] = [...userHandler];

export default handlers;

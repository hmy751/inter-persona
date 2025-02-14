import { http, HttpResponse, RequestHandler } from "msw";
import { baseURL } from "@/_apis/fetcher";
import { LoginBody } from "@/_apis/user";

const defaultUserHandler = [
  http.post<never, LoginBody>(`${baseURL}/login`, async ({ request }) => {
    const { name } = await request.json();
    return HttpResponse.json({
      id: 1,
      name,
      imageSrc: "/assets/images/dev_profile.png",
    });
  }),
];

const userHandler: RequestHandler[] = [...defaultUserHandler];

export default userHandler;
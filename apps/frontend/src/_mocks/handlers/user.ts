import { http, HttpResponse, RequestHandler } from "msw";
import { baseURL } from "@/_apis/fetcher";
import { LoginBody } from "@/_apis/user";

const defaultUserHandler = [
  http.post<never, LoginBody>(`${baseURL}/login`, async ({ request }) => {
    const { email, password } = await request.json();
    return HttpResponse.json({
      email,
      name: "명연",
      imageSrc: "/assets/images/dev_profile.png",
    });
  }),
];

const userHandler: RequestHandler[] = [...defaultUserHandler];

export default userHandler;
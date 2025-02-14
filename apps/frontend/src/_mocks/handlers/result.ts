import { http, HttpResponse, RequestHandler } from "msw";
import { baseURL } from "@/_apis/fetcher";
import { CreateResultBody } from "@/_apis/result";

const defaultResultHandler = [
  http.post<never, CreateResultBody>(
    `${baseURL}/result`,
    async ({ request }) => {
      const { interviewId } = await request.json();
      return HttpResponse.json({
        id: 1,
      });
    }
  ),
];

const resultHandler = [
  ...defaultResultHandler,
];

export default resultHandler;
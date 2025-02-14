import { http, HttpResponse, RequestHandler } from "msw";
import { baseURL } from "@/_apis/fetcher";
import {
  CreateResultBody,
  GetResultBody,
  GetResultScoreBody,
} from "@/_apis/result";

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
  http.get<never, GetResultBody>(
    `${baseURL}/result/:resultId`,
    async ({ params }) => {
      const { resultId } = params;
      return HttpResponse.json({
        id: 1,
        interviewId: 1,
        interviewerId: 1,
        userId: 1,
      });
    }
  ),
  http.get<never, GetResultScoreBody>(
    `${baseURL}/result/:resultId/score`,
    async ({ params }) => {
      const { resultId } = params;
      return HttpResponse.json({
        score: 80,
        questionCount: 12,
      });
    }
  ),
];

const resultHandler = [
  ...defaultResultHandler,
];

export default resultHandler;
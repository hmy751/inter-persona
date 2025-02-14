import { http, HttpResponse, RequestHandler } from "msw";
import { baseURL } from "@/_apis/fetcher";
import {
  CreateResultBody,
  GetResultBody,
  GetResultEvaluationBody,
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
  http.get<never, GetResultEvaluationBody>(
    `${baseURL}/result/:resultId/evaluation`,
    async ({ params }) => {
      const { resultId } = params;
      return HttpResponse.json({
        evaluation: [
          {
            title: "기술 이해도",
            score: 80,
            content: "기술 이해도가 높습니다.",
          },
          {
            title: "문장 구성",
            score: 85,
            content: "문장 구성이 좋습니다.",
          },
          {
            title: "커뮤니케이션",
            score: 70,
            content: "커뮤니케이션이 좋습니다.",
          },
        ],
      });
    }
  ),
];

const resultHandler = [
  ...defaultResultHandler,
];

export default resultHandler;
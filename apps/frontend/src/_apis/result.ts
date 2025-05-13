import { z } from 'zod';
import fetcher from './fetcher';
import {
  CreateResultRequestSchema,
  CreateResultResponseSchema,
  GetResultRequestSchema,
  GetResultResponseSchema,
} from '@repo/schema/result';

/**
 * 인터뷰 결과 생성
 */
type CreateResultBody = z.infer<typeof CreateResultRequestSchema>;

type CreateResultResponse = z.infer<typeof CreateResultResponseSchema>;

export const fetchCreateResult = async ({ interviewId }: CreateResultBody) => {
  return fetcher.post<CreateResultResponse>(
    'result',
    {
      interviewId,
    },
    {
      timeout: 50000,
    }
  );
};

/**
 * 인터뷰 결과 조회
 */
type GetResultBody = z.infer<typeof GetResultRequestSchema>;

type GetResultResponse = z.infer<typeof GetResultResponseSchema>;

export const fetchGetResult = async ({ id }: GetResultBody) => {
  return fetcher.get<GetResultResponse>(`result/${id}`);
};

/**
 * 인터뷰 결과 점수 조회
 */
export interface GetResultScoreBody {
  resultId: number;
}
export interface GetResultScoreResponse {
  score: number;
  questionCount: number;
}

export const fetchGetResultScore = async ({ resultId }: GetResultScoreBody) => {
  return fetcher.get<GetResultScoreResponse>(`result/${resultId}/score`);
};

/**
 * 인터뷰 결과 평가 조회
 */

interface Evaluation {
  title: string;
  score: number;
  content: string;
}
export interface GetResultTotalEvaluationBody {
  resultId: number;
}
export interface GetResultTotalEvaluationResponse {
  evaluation: Evaluation[];
}

export const fetchGetResultTotalEvaluation = async ({ resultId }: GetResultTotalEvaluationBody) => {
  return fetcher.get<GetResultTotalEvaluationResponse>(`result/${resultId}/total`);
};

/**
 * 인터뷰 결과 문제 평가 조회
 */

interface QuestionEvaluation {
  title: string;
  score: number;
  content: string;
}
export interface GetResultQuestionEvaluationBody {
  resultId: number;
}
export interface GetResultQuestionEvaluationResponse {
  questionEvaluation: QuestionEvaluation[];
}

export const fetchGetResultQuestionEvaluation = async ({ resultId }: GetResultQuestionEvaluationBody) => {
  return fetcher.get<GetResultQuestionEvaluationResponse>(`result/${resultId}/question`);
};

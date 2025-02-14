import fetcher from "./fetcher";

/**
 * 인터뷰 결과 생성 
 */
export interface CreateResultBody {
  interviewId: number;
}
export interface CreateResultResponse {
  id: number;
}

export const fetchCreateResult = async ({
  interviewId,
}: CreateResultBody) => {
  return fetcher.post<CreateResultResponse>("result", {
    interviewId,
  });
};

/**
 * 인터뷰 결과 조회 
 */
export interface GetResultBody {
  resultId: number;
}
export interface GetResultResponse {
  id: number;
  interviewId: number;
  interviewerId: number;
  userId: number;
}

export const fetchGetResult = async ({ resultId }: GetResultBody) => {
  return fetcher.get<GetResultResponse>(`result/${resultId}`);
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

export const fetchGetResultTotalEvaluation = async ({
  resultId,
}: GetResultTotalEvaluationBody) => {
  return fetcher.get<GetResultTotalEvaluationResponse>(
    `result/${resultId}/total`
  );
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

export const fetchGetResultQuestionEvaluation = async ({
  resultId,
}: GetResultQuestionEvaluationBody) => {
  return fetcher.get<GetResultQuestionEvaluationResponse>(
    `result/${resultId}/question`
  );
};

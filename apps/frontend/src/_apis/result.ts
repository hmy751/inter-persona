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

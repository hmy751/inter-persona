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

import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchInterviewerList } from '@/_apis/interviewer';
import { InterviewerListResponseSchema } from '@repo/schema/interviewer';
import { APIError } from '@/_libs/error/errors';

type InterviewerListResponse = z.infer<typeof InterviewerListResponseSchema>;

export const useGetInterviewerList = () => {
  return useQuery<InterviewerListResponse>({
    queryKey: ['interviewer'],
    queryFn: async () => {
      const response = await fetchInterviewerList();
      const parsedData = InterviewerListResponseSchema.safeParse(response);

      if (parsedData.success) {
        return parsedData.data;
      } else {
        throw new APIError('인터뷰어 목록 조회에 실패했습니다. 다시 시도해주세요.', 404, 'NOT_FOUND', parsedData.error);
      }
    },
  });
};

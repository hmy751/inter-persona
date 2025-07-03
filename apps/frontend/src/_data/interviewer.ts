import { QueryKey, useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchInterviewerList } from '@/_apis/interviewer';
import { InterviewerListResponseSchema } from '@repo/schema/interviewer';
import { ClientServerMismatchedError } from '@/_libs/error/errors';

type InterviewerListResponse = z.infer<typeof InterviewerListResponseSchema>;

export const interviewerQueryKeys = {
  all: ['interviewer'] as const,
};

export const useSuspenseGetInterviewerList = () => {
  return useSuspenseQuery<InterviewerListResponse>({
    queryKey: interviewerQueryKeys.all,
    queryFn: async () => {
      const response = await fetchInterviewerList();
      const parsedData = InterviewerListResponseSchema.safeParse(response);

      if (parsedData.success) {
        return parsedData.data;
      } else {
        throw new ClientServerMismatchedError({
          data: parsedData.error,
        });
      }
    },
  });
};

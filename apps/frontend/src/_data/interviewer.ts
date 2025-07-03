import { QueryKey, useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchInterviewerList } from '@/_apis/interviewer';
import { InterviewerListResponseSchema } from '@repo/schema/interviewer';
import { ClientServerMismatchedError } from '@/_libs/error/errors';

type InterviewerListResponse = z.infer<typeof InterviewerListResponseSchema>;

export const QUERY_KEY = ['interviewer'] as QueryKey;

export const useSuspenseGetInterviewerList = () => {
  return useSuspenseQuery<InterviewerListResponse>({
    queryKey: QUERY_KEY,
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

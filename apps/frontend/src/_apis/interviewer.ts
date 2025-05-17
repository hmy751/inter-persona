import fetcher from './fetcher';
import { z } from 'zod';
import { InterviewerListResponseSchema } from '@repo/schema/interviewer';

type InterviewerListResponse = z.infer<typeof InterviewerListResponseSchema>;

export const fetchInterviewerList = async () => {
  return fetcher.get<InterviewerListResponse>('/api/interviewer');
};

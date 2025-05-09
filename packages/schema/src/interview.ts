import { z } from 'zod';

export const InterviewRequestSchema = z.object({
  interviewerId: z.number().int().positive(),
  userId: z.number().int().positive(),
  category: z.string(),
});

export const InterviewResponseSchema = z.object({
  interviewId: z.number().int().positive(),
});

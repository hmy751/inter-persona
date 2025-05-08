import { z } from 'zod';

export const InterviewerRequestSchema = z.object({
  id: z.number(),
});

export const InterviewerResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  persona: z.object({
    mbti: z.string(),
    style: z.string(),
    focus: z.string(),
  }),
  profileImageUrl: z.string(),
});

export const InterviewerListResponseSchema = z.array(InterviewerResponseSchema);

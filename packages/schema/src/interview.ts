import { z } from 'zod';
import { InterviewerResponseSchema } from './interviewer';
import { UserInfoResponseSchema } from './user';

export const InterviewRequestSchema = z.object({
  interviewerId: z.number().int().positive(),
  userId: z.number().int().positive(),
  category: z.string(),
});

export const InterviewResponseSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewInterviewerRequestSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewInterviewerResponseSchema = z.object({
  interviewer: InterviewerResponseSchema,
});

export const InterviewUserRequestSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewUserResponseSchema = z.object({
  user: UserInfoResponseSchema,
});

export const InterviewContentsRequestSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewContentSchema = z.object({
  id: z.number().int().positive(),
  content: z.string(),
  speaker: z.enum(['interviewer', 'user']),
  createdAt: z.string().datetime(),
});

export const InterviewContentsResponseSchema = z.object({
  contents: z.array(InterviewContentSchema).optional(),
});

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

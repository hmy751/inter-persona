import { z } from 'zod';
import { InterviewerResponseSchema } from './interviewer';
import { UserInfoResponseSchema } from './user';

export const InterviewCreateRequestSchema = z.object({
  interviewerId: z.number().int().positive(),
  userId: z.number().int().positive(),
  category: z.string(),
});

export const InterviewCreateResponseSchema = z.object({
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
  createdAt: z.date(),
});

export const InterviewContentsResponseSchema = z.object({
  contents: z.array(InterviewContentSchema).optional(),
});

export const InterviewStartRequestSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewStartResponseSchema = z.object({
  content: z.string(),
  speaker: z.enum(['interviewer', 'user']),
});

export const InterviewAnswerRequestSchema = z.object({
  interviewId: z.number().int().positive(),
  content: z.string(),
});

export const InterviewAnswerResponseSchema = z.object({
  content: z.string(),
  speaker: z.enum(['interviewer', 'user']),
});

export const InterviewStatusRequestSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewStatusResponseSchema = z.object({
  status: z.enum(['ongoing', 'completed']),
});

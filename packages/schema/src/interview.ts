import { z } from 'zod';
import { InterviewerSchema } from './interviewer';
import { UserSchema } from './user';

/**
 * 모델 스키마
 */
export const InterviewContentSchema = z.object({
  id: z.number().int().positive(),
  content: z.string(),
  speaker: z.enum(['interviewer', 'user']),
  createdAt: z.date(),
});

export const InterviewSchema = z.object({
  id: z.number().int().positive(),
  interviewerId: z.number().int().positive(),
  userId: z.number().int().positive(),
  user: UserSchema,
  interviewer: InterviewerSchema,
  category: z.string(),
  contents: z.array(InterviewContentSchema).optional(),
  status: z.enum(['ongoing', 'completed']),
});

/**
 * 요청, 응답 스키마
 */
export const InterviewRequestSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewResponseSchema = z.object({
  interview: InterviewSchema,
});

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
  interviewer: InterviewerSchema,
});

export const InterviewUserRequestSchema = z.object({
  interviewId: z.number().int().positive(),
});

export const InterviewUserResponseSchema = z.object({
  user: UserSchema,
});

export const InterviewContentsRequestSchema = z.object({
  interviewId: z.number().int().positive(),
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

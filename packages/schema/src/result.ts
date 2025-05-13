import { z } from 'zod';
import { InterviewerSchema } from './interviewer';
import { UserSchema } from './user';

/**
 * 모델 및 타입
 */
export const ResultScoresSchema = z.array(
  z.object({
    standard: z.string(),
    score: z.number(),
    summary: z.string(),
  })
);

export const ResultContentsFeedbackSchema = z.array(
  z.object({
    question: z.string(),
    feedback: z.string(),
  })
);

export const ResultFeedbackSchema = z.string();

/**
 * 요청 및 응답
 */
export const CreateResultRequestSchema = z.object({
  interviewId: z.number(),
});

export const CreateResultResponseSchema = z.object({
  id: z.number(),
  interviewId: z.number(),
  interviewerId: z.number(),
});

export const GetResultRequestSchema = z.object({
  id: z.number(),
});

export const GetResultResponseSchema = z.object({
  id: z.number(),
  interviewId: z.number(),
  interviewerId: z.number(),
  interviewer: InterviewerSchema,
  userId: z.number(),
  user: UserSchema,
  contentFeedback: ResultContentsFeedbackSchema,
  feedback: ResultFeedbackSchema,
  scores: ResultScoresSchema,
});

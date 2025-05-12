import fetcher from './fetcher';
import { Interviewer, User } from './model';
import { z } from 'zod';
import {
  InterviewRequestSchema,
  InterviewResponseSchema,
  InterviewInterviewerRequestSchema,
  InterviewInterviewerResponseSchema,
  InterviewUserRequestSchema,
  InterviewUserResponseSchema,
  InterviewContentsResponseSchema,
  InterviewContentsRequestSchema,
  InterviewStartRequestSchema,
  InterviewStartResponseSchema,
  InterviewAnswerRequestSchema,
  InterviewAnswerResponseSchema,
} from '@repo/schema/interview';

/**
 * 인터뷰, 인터뷰어 조회
 */
export type GetInterviewInterviewerBody = z.infer<typeof InterviewInterviewerRequestSchema>;

export type GetInterviewInterviewerResponse = z.infer<typeof InterviewInterviewerResponseSchema>;

export const fetchGetInterviewInterviewer = async ({ interviewId }: GetInterviewInterviewerBody) => {
  return fetcher.get<GetInterviewInterviewerResponse>(`interview/${interviewId}/interviewer`);
};

/**
 * 인터뷰, 유저 조회
 */
export type GetInterviewUserBody = z.infer<typeof InterviewUserRequestSchema>;

export type GetInterviewUserResponse = z.infer<typeof InterviewUserResponseSchema>;

export const fetchGetInterviewUser = async ({ interviewId }: GetInterviewUserBody) => {
  return fetcher.get<GetInterviewUserResponse>(`interview/${interviewId}/user`);
};

/**
 * 인터뷰 생성
 */
type CreateInterviewBody = z.infer<typeof InterviewRequestSchema>;

type CreateInterviewResponse = z.infer<typeof InterviewResponseSchema>;

export const fetchCreateInterview = async ({ interviewerId, userId, category }: CreateInterviewBody) => {
  return fetcher.post<CreateInterviewResponse>('interview', {
    interviewerId,
    userId,
    category,
  });
};

/**
 * 인터뷰 컨텐츠 조회
 */
export type GetInterviewContentsBody = z.infer<typeof InterviewContentsRequestSchema>;

export type GetInterviewContentsResponse = z.infer<typeof InterviewContentsResponseSchema>;

export const fetchGetInterviewContents = async ({ interviewId }: GetInterviewContentsBody) => {
  return fetcher.get<GetInterviewContentsResponse>(`interview/${interviewId}/contents`);
};

/**
 * 인터뷰 시작
 */
export type StartInterviewBody = z.infer<typeof InterviewStartRequestSchema>;

export type StartInterviewResponse = z.infer<typeof InterviewStartResponseSchema>;

export const fetchStartInterview = async ({ interviewId }: StartInterviewBody) => {
  return fetcher.post<StartInterviewResponse>(`interview/${interviewId}/start`);
};

/**
 * 음성 텍스트 변환
 */
interface SpeechToTextProps {
  formData: FormData;
}
export interface SpeechToTextData {
  text: string;
}

export const fetchSpeechToText = async ({ formData }: SpeechToTextProps): Promise<SpeechToTextData | undefined> => {
  try {
    const result = await fetch('/api/interview', {
      method: 'POST',
      body: formData,
    });

    const data: SpeechToTextData = await result.json();
    if (!result.ok) {
      throw Error('Http Error');
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

/**
 * 인터뷰 답변
 */
export type AnswerBody = z.infer<typeof InterviewAnswerRequestSchema>;

export type AnswerData = z.infer<typeof InterviewAnswerResponseSchema>;

export const fetchAnswer = async ({ interviewId, content }: AnswerBody) => {
  return fetcher.post<AnswerData>(`interview/${interviewId}/contents/answer`, {
    content,
  });
};

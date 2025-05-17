import fetcher from './fetcher';
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
  InterviewStatusResponseSchema,
  InterviewStatusRequestSchema,
  InterviewCreateRequestSchema,
  InterviewCreateResponseSchema,
} from '@repo/schema/interview';

/**
 * 인터뷰 조회
 */
export type GetInterviewBody = z.infer<typeof InterviewRequestSchema>;

export type GetInterviewResponse = z.infer<typeof InterviewResponseSchema>;

export const fetchGetInterview = async ({ interviewId }: GetInterviewBody) => {
  return fetcher.get<GetInterviewResponse>(`/api/interview/${interviewId}`);
};

/**
 * 인터뷰, 인터뷰어 조회
 */
export type GetInterviewInterviewerBody = z.infer<typeof InterviewInterviewerRequestSchema>;

export type GetInterviewInterviewerResponse = z.infer<typeof InterviewInterviewerResponseSchema>;

export const fetchGetInterviewInterviewer = async ({ interviewId }: GetInterviewInterviewerBody) => {
  return fetcher.get<GetInterviewInterviewerResponse>(`/api/interview/${interviewId}/interviewer`);
};

/**
 * 인터뷰, 유저 조회
 */
export type GetInterviewUserBody = z.infer<typeof InterviewUserRequestSchema>;

export type GetInterviewUserResponse = z.infer<typeof InterviewUserResponseSchema>;

export const fetchGetInterviewUser = async ({ interviewId }: GetInterviewUserBody) => {
  return fetcher.get<GetInterviewUserResponse>(`/api/interview/${interviewId}/user`);
};

/**
 * 인터뷰 생성
 */
export type CreateInterviewBody = z.infer<typeof InterviewCreateRequestSchema>;

export type CreateInterviewResponse = z.infer<typeof InterviewCreateResponseSchema>;

export const fetchCreateInterview = async ({ interviewerId, userId, category }: CreateInterviewBody) => {
  return fetcher.post<CreateInterviewResponse>('/api/interview', {
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
  return fetcher.get<GetInterviewContentsResponse>(`/api/interview/${interviewId}/contents`);
};

/**
 * 인터뷰 시작
 */
export type StartInterviewBody = z.infer<typeof InterviewStartRequestSchema>;

export type StartInterviewResponse = z.infer<typeof InterviewStartResponseSchema>;

export const fetchStartInterview = async ({ interviewId }: StartInterviewBody) => {
  return fetcher.post<StartInterviewResponse>(`/api/interview/${interviewId}/start`);
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
  return fetcher.post<AnswerData>(`/api/interview/${interviewId}/contents/answer`, {
    content,
  });
};

/**
 * 인터뷰 상태 조회
 */
export type GetInterviewStatusBody = z.infer<typeof InterviewStatusRequestSchema>;

export type GetInterviewStatusResponse = z.infer<typeof InterviewStatusResponseSchema>;

export const fetchGetInterviewStatus = async ({ interviewId }: GetInterviewStatusBody) => {
  return fetcher.get<GetInterviewStatusResponse>(`/api/interview/${interviewId}/status`);
};

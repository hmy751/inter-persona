import fetcher from "./fetcher";
import { Interviewer, User } from "./model";
/**
 * 인터뷰 조회
 */
export interface GetInterviewBody {
  interviewId: number;
}
export interface GetInterviewResponse {
  id: number;
  interviewerId: number;
  userId: number;
}

export const fetchGetInterview = async ({
  interviewId,
}: GetInterviewBody) => {
  return fetcher.get<GetInterviewResponse>(`interview/${interviewId}`);
};

/**
 * 인터뷰 생성
 */
export interface CreateInterviewBody {
  interviewerId: number;
  userId: number;
}
export interface CreateInterviewResponse {
  id: number;
}

export const fetchCreateInterview = async ({
  interviewerId,
  userId,
}: CreateInterviewBody) => {
  return fetcher.post<CreateInterviewResponse>("interview", {
    interviewerId,
    userId,
  });
};

/**
 * 인터뷰, 인터뷰어 조회
 */
export interface GetInterviewInterviewerBody {
  interviewId: number;
}
export interface GetInterviewInterviewerResponse {
  interviewer: Interviewer;
}

export const fetchGetInterviewInterviewer = async ({
  interviewId,
}: GetInterviewInterviewerBody) => {
  return fetcher.get<GetInterviewInterviewerResponse>(
    `interview/${interviewId}/interviewer`
  );
};

/**
 * 인터뷰, 유저 조회
 */
export interface GetInterviewUserBody {
  interviewId: number;
}
export interface GetInterviewUserResponse {
  user: User;
}

export const fetchGetInterviewUser = async ({
  interviewId,
}: GetInterviewUserBody) => {
  return fetcher.get<GetInterviewUserResponse>(`interview/${interviewId}/user`);
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

export const fetchSpeechToText = async ({
  formData,
}: SpeechToTextProps): Promise<SpeechToTextData | undefined> => {
  try {
    const result = await fetch("/api/interview", {
      method: "POST",
      body: formData,
    });

    const data: SpeechToTextData = await result.json();
    if (!result.ok) {
      throw Error("Http Error");
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};

/**
 * 인터뷰 답변
 */
export interface AnswerBody {
  interviewId: number;
  content: string;
}

export interface AnswerData {
  content: string;
}

export const fetchAnswer = async ({ interviewId, content }: AnswerBody) => {
  return fetcher.post<AnswerData>(`interview/${interviewId}/contents/answer`, {
    content,
  });
};


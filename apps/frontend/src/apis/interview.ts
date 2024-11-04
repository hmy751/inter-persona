import { post } from "./index";

interface InterviewData {
  id: number;
}

export interface InterviewBody {
  interviewerId: number;
  reviewerId: number;
}

export const fetchInterview = async ({
  interviewerId,
  reviewerId,
}: InterviewBody) => {
  return post<InterviewData>({
    path: "interview",
    body: {
      interviewerId,
      reviewerId,
    },
  });
};

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
    const result = await fetch("/api/chat", {
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

interface AIChatProps {
  chatId: number;
  content: string;
}

export interface AIChatData {
  content: string;
}

export const fetchAIChat = async ({ chatId, content }: AIChatProps) => {
  return post<AIChatData>({
    path: `interview/${chatId}/contents`,
    body: {
      content,
    },
  });
};

import fetcher from "./fetcher";

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
  return fetcher.post<InterviewData>("interview",
    {
      interviewerId,
      reviewerId,
    }
  );
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

export interface AIChatBody {
  chatId: number;
  content: string;
}

export interface AIChatData {
  content: string;
}

export const fetchAIChat = async ({ chatId, content }: AIChatBody) => {
  return fetcher.post<AIChatData>(`interview/${chatId}/contents`, {
    content,
  });
};

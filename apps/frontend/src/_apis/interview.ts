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

export interface AnswerBody {
  interviewId: number;
  content: string;
}

export interface AnswerData {
  content: string;
}

export const fetchAnswer = async ({ interviewId, content }: AnswerBody) => {
  return fetcher.post<AnswerData>(`interview/${interviewId}/contents`, {
    content,
  });
};


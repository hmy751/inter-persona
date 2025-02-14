import fetcher from "./fetcher";

export interface Interviewer {
  id: number;
  imgUrl: string;
  name: string;
  mbti: string;
  description: string;
}

export interface InterviewerResponse {
  list: Interviewer[];
}

export const fetchInterviewer = async () => {
  return fetcher.get<InterviewerResponse>("interviewer");
};
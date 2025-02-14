import fetcher from "./fetcher";
import { Interviewer } from "./model";

export interface InterviewerResponse {
  list: Interviewer[];
}

export const fetchInterviewer = async () => {
  return fetcher.get<InterviewerResponse>("interviewer");
};
import fetcher from "./fetcher";
import { Interviewer } from "./model";

export interface InterviewerListResponse {
  list: Interviewer[];
}

export const fetchInterviewerList = async () => {
  return fetcher.get<InterviewerListResponse>("interviewer");
};

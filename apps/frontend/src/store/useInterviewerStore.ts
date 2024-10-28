import { create } from "zustand";

interface Interviewer {
  id: number;
  name: string;
  imgUrl: string;
  mbti: string;
  description: string;
}

interface InterviewerState {
  interviewer: Interviewer | null;
  setInterviewer: (interviewer: Interviewer | null) => void;
}

export const useInterviewerStore = create<InterviewerState>((set) => ({
  interviewer: null,
  setInterviewer: (interviewer: Interviewer | null) => set({ interviewer }),
}));

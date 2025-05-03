import { create } from 'zustand';

const interviewerList = [
  {
    id: 1,
    imgUrl: '/images/ENFP.webp',
    name: '민지',
    mbti: 'ENFP',
    description:
      '이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.',
  },
  {
    id: 2,
    imgUrl: '/images/ESTJ.webp',
    name: '철수',
    mbti: 'ESTJ',
    description:
      '이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.',
  },
  {
    id: 3,
    imgUrl: '/images/ISFP.webp',
    name: '영희',
    mbti: 'ISFP',
    description:
      '이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.',
  },
];
interface Interviewer {
  id: number;
  name: string;
  imgUrl: string;
  mbti: string;
  description: string;
}

interface InterviewerState {
  interviewer: Interviewer | null;
  setInterviewerId: (id: number) => void;
}

export const useInterviewerStore = create<InterviewerState>(set => ({
  interviewer: interviewerList[0] as Interviewer,
  setInterviewerId: (id: number) => set({ interviewer: interviewerList[id - 1] }),
}));

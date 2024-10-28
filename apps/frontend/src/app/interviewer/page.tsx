"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { Box, Button } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import React from "react";
import Background from "./_components/Background";
import Camera from "./_components/Camera";
import InterviewerCard from "./_components/InterviewerCard";
import { nomalizeIndex } from "./_utils/convert";
import InterviewerInfo from "./_components/InterviewerInfo";
import { Html } from "@react-three/drei";
import { useInterviewerStore } from "@/store/useInterviewerStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";

const interviewerList = [
  {
    id: 1,
    imgUrl: "/images/ENFP.webp",
    name: "민지",
    mbti: "ENFP",
    description:
      "이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.",
  },
  {
    id: 2,
    imgUrl: "/images/ESTJ.webp",
    name: "철수",
    mbti: "ESTJ",
    description:
      "이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.",
  },
  {
    id: 3,
    imgUrl: "/images/ISFP.webp",
    name: "영희",
    mbti: "ISFP",
    description:
      "이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.",
  },
];

interface Interviewer {
  id: number;
  name: string;
  imgUrl: string;
  mbti: string;
}

const InterviewerChoicePage: React.FC = () => {
  const [selectedInterviewer, setSelectedInterviewer] =
    React.useState<Interviewer | null>(interviewerList[0]);

  const router = useRouter();

  const { play } = useAudioStore();
  const { setInterviewer } = useInterviewerStore();
  const { user } = useUserStore();

  const handleClick = (interviewer: Interviewer) => {
    setSelectedInterviewer(interviewer);
  };

  const selectInterviewer = (interviewer: Interviewer | null) => {
    setInterviewer(interviewer);
    router.push(`/chat/31`);
  };

  return (
    <Box>
      <Canvas
        style={{
          display: "block",
          width: "100vw",
          aspectRatio: "16/9",
          margin: "0 auto",
        }}
      >
        <Camera />
        <Background imageUrl={selectedInterviewer?.imgUrl || ""} />
        <InterviewerInfo selectedInterviewer={selectedInterviewer} />
        {interviewerList.map((interviewer, index) => (
          <InterviewerCard
            key={interviewer.id}
            imgUrl={interviewer.imgUrl}
            position={[nomalizeIndex(index, interviewerList.length), -2.5, 0]}
            onClick={() => {
              handleClick(interviewer);
              play();
            }}
          />
        ))}
        <Html position={[3, 1.5, 0]}>
          <Button
            color={"white"}
            padding={"10px"}
            bg={"rgba(0, 0, 0, 0.7)"}
            borderRadius={"10px"}
            onClick={() => {
              selectInterviewer(selectedInterviewer);
            }}
          >
            선택
          </Button>
        </Html>
      </Canvas>
    </Box>
  );
};

export default InterviewerChoicePage;

import InterviewerCard from "./_components/InterviewerCard";
import { useInterviewerStore } from "@/store/useInterviewerStore";
// import useUserStore from "@/store/useUserStore";
// import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Text from "@repo/ui/Text";

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
  description: string;
}

const InterviewerChoicePage: React.FC = () => {
  // const [selectedInterviewer, setSelectedInterviewer] =
  //   React.useState<Interviewer | null>(interviewerList[0] as Interviewer);

  // const router = useRouter();

  const { setInterviewer } = useInterviewerStore();
  // const { user } = useUserStore();

  // const handleClick = (interviewer: Interviewer) => {
  //   setSelectedInterviewer(interviewer);
  // };

  // const selectInterviewer = (interviewer: Interviewer | null) => {
  //   setInterviewer(interviewer);
  //   router.push(`/chat/31`);
  // };

  return (
    <div className={styles.container}>
      <Text as="h2" size="2xl" align="center">
        면접관 선택
      </Text>
      {interviewerList.map((interviewer, index) => (
        <InterviewerCard
          key={interviewer.id}
          imgUrl={interviewer.imgUrl}
          name={interviewer.name}
          mbti={interviewer.mbti}
          description={interviewer.description}
        />
      ))}
    </div>
  );
};

export default InterviewerChoicePage;

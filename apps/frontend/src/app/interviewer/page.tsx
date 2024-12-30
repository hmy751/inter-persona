import InterviewerCard from "./_components/InterviewerCard";
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

const InterviewerChoicePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" align="center" className={styles.title}>
        Select Interviewer
      </Text>
      {interviewerList.map((interviewer, index) => (
        <InterviewerCard
          id={interviewer.id}
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

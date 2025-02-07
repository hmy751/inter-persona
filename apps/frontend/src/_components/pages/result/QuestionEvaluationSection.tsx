import Text from "@repo/ui/Text";
import styles from "./QuestionEvaluationSection.module.css";
interface QuestionEvaluationSectionProps {}

const list = [
  {
    title: "자바스크립트 클로저 문제",
    score: 80,
    evaluation: "기술적 클로저 부분에 이해도가 부족합니다.",
  },
  {
    title: "자바스크립트 클로저 문제",
    score: 80,
    evaluation: "기술적 클로저 부분에 이해도가 부족합니다.",
  },
  {
    title: "자바스크립트 클로저 문제",
    score: 80,
    evaluation: "기술적 클로저 부분에 이해도가 부족합니다.",
  },
  {
    title: "자바스크립트 클로저 문제",
    score: 80,
    evaluation: "기술적 클로저 부분에 이해도가 부족합니다.",
  },
  {
    title: "자바스크립트 클로저 문제",
    score: 80,
    evaluation: "기술적 클로저 부분에 이해도가 부족합니다.",
  },
  {
    title: "자바스크립트 클로저 문제",
    score: 80,
    evaluation: "기술적 클로저 부분에 이해도가 부족합니다.",
  },
];

export default function QuestionEvaluationSection({}: QuestionEvaluationSectionProps): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <Text as="h3" size="md">
        Question Evaluation
      </Text>
      {list.map(({ title, score, evaluation }, index) => (
        <div className={styles.question}>
          <div className={styles.questionHeader}>
            <Text size="sm" weight="bold">
              {index + 1}. {title}
            </Text>
            <Text size="sm" className={styles.questionScore}>
              {score}%
            </Text>
          </div>
          <Text size="sm">{evaluation}</Text>
        </div>
      ))}
    </div>
  );
}

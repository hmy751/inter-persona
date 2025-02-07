import styles from "./TotalEvaluationSection.module.css";
import Text from "@repo/ui/Text";

interface TotalEvaluationSectionProps {}

const list = [
  { title: "기술 이해도", score: 80, content: "기술 이해도가 높습니다." },
  { title: "문장 구성", score: 85, content: "문장 구성이 좋습니다." },
  { title: "커뮤니케이션", score: 70, content: "커뮤니케이션이 좋습니다." },
];

export default function TotalEvaluationSection({}: TotalEvaluationSectionProps): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <Text as="h3" size="md">
        Total Evaluation
      </Text>
      {list.map((item) => (
        <div className={styles.evaluation}>
          <div className={styles.evaluationHeader}>
            <Text size="sm" weight="bold">
              {item.title}
            </Text>
            <Text size="sm" className={styles.evaluationScore}>
              {item.score}%
            </Text>
          </div>
          <Text size="sm">{item.content}</Text>
        </div>
      ))}
    </div>
  );
}

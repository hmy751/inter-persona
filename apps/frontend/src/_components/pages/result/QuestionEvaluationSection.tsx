import Text from "@repo/ui/Text";
import styles from "./QuestionEvaluationSection.module.css";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchGetResultQuestionEvaluation } from "@/_apis/result";

interface QuestionEvaluationSectionProps {}

export default function QuestionEvaluationSection({}: QuestionEvaluationSectionProps): React.ReactElement {
  const { resultId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["result", resultId, "question"],
    queryFn: () =>
      fetchGetResultQuestionEvaluation({ resultId: Number(resultId) }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    return <div>no data</div>;
  }

  return (
    <div className={styles.wrapper}>
      <Text as="h3" size="md">
        Question Evaluation
      </Text>
      {data?.questionEvaluation.map(({ title, score, content }, index) => (
        <div className={styles.question}>
          <div className={styles.questionHeader}>
            <Text size="sm" weight="bold">
              {index + 1}. {title}
            </Text>
            <Text size="sm" className={styles.questionScore}>
              {score}%
            </Text>
          </div>
          <Text size="sm">{content}</Text>
        </div>
      ))}
    </div>
  );
}

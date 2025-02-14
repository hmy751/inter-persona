import styles from "./TotalEvaluationSection.module.css";
import Text from "@repo/ui/Text";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchGetResultEvaluation } from "@/_apis/result";

interface TotalEvaluationSectionProps {}

export default function TotalEvaluationSection({}: TotalEvaluationSectionProps): React.ReactElement {
  const { resultId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["result", resultId, "evaluation"],
    queryFn: () => fetchGetResultEvaluation({ resultId: Number(resultId) }),
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
        Total Evaluation
      </Text>
      {data.evaluation.map((item) => (
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

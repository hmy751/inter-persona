import Text from "@repo/ui/Text";
import styles from "./ScoreSection.module.css";
import ProgressBar from "./ProgressBar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchGetResultScore } from "@/_apis/result";

interface ScoreSectionProps {}

export default function ScoreSection({}: ScoreSectionProps): React.ReactElement {
  const { resultId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["result", resultId, "score"],
    queryFn: () => fetchGetResultScore({ resultId: Number(resultId) }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    return <div>no data</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.scoreWrapper}>
          <Text as="h3" size="md">
            Score
          </Text>
          <Text size="lg" align="right" weight="bold">
            {data?.score}%
          </Text>
        </div>
        <div className={styles.scoreWrapper}>
          <Text as="h3" size="md">
            Question
          </Text>
          <Text size="lg" align="right" weight="bold">
            {data?.questionCount}
          </Text>
        </div>
      </div>
      <ProgressBar score={data?.score ?? 0} duration={1500} />
    </div>
  );
}

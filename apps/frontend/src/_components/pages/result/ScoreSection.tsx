import Text from "@repo/ui/Text";
import styles from "./ScoreSection.module.css";
import ProgressBar from "./ProgressBar";
import { useGetResultScore } from "@/_data/result";

interface ScoreSectionProps {}

export default function ScoreSection({}: ScoreSectionProps): React.ReactElement {
  const { data, isLoading, error } = useGetResultScore();

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

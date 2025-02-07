import Text from "@repo/ui/Text";
import styles from "./ScoreSection.module.css";
import ProgressBar from "./ProgressBar";

interface ScoreSectionProps {}

export default function ScoreSection({}: ScoreSectionProps): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.scoreWrapper}>
          <Text as="h3" size="md">
            Score
          </Text>
          <Text size="lg" align="right" weight="bold">
            80%
          </Text>
        </div>
        <div className={styles.scoreWrapper}>
          <Text as="h3" size="md">
            Question
          </Text>
          <Text size="lg" align="right" weight="bold">
            12
          </Text>
        </div>
      </div>
      <ProgressBar score={80} duration={1500} />
    </div>
  );
}

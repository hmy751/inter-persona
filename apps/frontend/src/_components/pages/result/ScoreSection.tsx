import Text from '@repo/ui/Text';
import styles from './ScoreSection.module.css';
import ProgressBar from './ProgressBar';
import { useGetResult } from '@/_data/result';
import { useParams } from 'next/navigation';

export default function ScoreSection(): React.ReactElement {
  const resultId = useParams().resultId;
  const { data, isLoading, error } = useGetResult(Number(resultId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    return <div>no data</div>;
  }

  const score = data?.scores.reduce((acc, curr) => acc + curr.score, 0) / data.scores.length;
  const questionCount = data?.contentFeedback.length ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.scoreWrapper}>
          <Text as="h3" size="md">
            Score
          </Text>
          <Text size="lg" align="right" weight="bold">
            {score}%
          </Text>
        </div>
        <div className={styles.scoreWrapper}>
          <Text as="h3" size="md">
            Question
          </Text>
          <Text size="lg" align="right" weight="bold">
            {questionCount}
          </Text>
        </div>
      </div>
      <ProgressBar score={score} duration={1500} />
    </div>
  );
}

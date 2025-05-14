import styles from './TotalEvaluationSection.module.css';
import Text from '@repo/ui/Text';
import { useGetResult } from '@/_data/result';
import { useParams } from 'next/navigation';

export default function TotalEvaluationSection(): React.ReactElement {
  const resultId = useParams().resultId;
  const { data, isLoading, error } = useGetResult(Number(resultId));

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
      {data.scores.map(item => (
        <div className={styles.evaluation} key={item.standard}>
          <div className={styles.evaluationHeader}>
            <Text size="sm" weight="bold">
              {item.standard}
            </Text>
            <Text size="sm" className={styles.evaluationScore}>
              {item.score}%
            </Text>
          </div>
          <Text size="sm">{item.summary}</Text>
        </div>
      ))}
    </div>
  );
}

'use client';

import styles from './TotalEvaluationSection.module.css';
import Text from '@repo/ui/Text';
import { useGetResult } from '@/_data/result';
import { useParams } from 'next/navigation';
import { ErrorFallbackProps } from '@/_components/layout/error/ErrorBoundary';
import Button from '@repo/ui/Button';

function TotalEvaluationSection(): React.ReactElement {
  const resultId = Number(useParams().resultId);
  const { data } = useGetResult(resultId);

  return (
    <div className={styles.wrapper}>
      <Text as="h3" size="md">
        Total Evaluation
      </Text>
      {data?.scores.map(item => (
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

function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.skeletonTitle} ${styles.skeleton}`} />
      {Array.from({ length: 3 }).map((_, index) => (
        <div className={styles.evaluation} key={index}>
          <div className={`${styles.skeletonHeader} ${styles.skeleton}`} />
          <div className={`${styles.skeletonText} ${styles.skeleton}`} />
          <div className={`${styles.skeletonText} ${styles.skeleton}`} style={{ width: '80%' }} />
        </div>
      ))}
    </div>
  );
}

function Error({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className={styles.wrapper}>
      <Text as="p" size="md" color="error">
        종합 평가를 불러오는 데 실패했습니다.
      </Text>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </div>
  );
}

export default TotalEvaluationSection;

TotalEvaluationSection.Loading = Loading;
TotalEvaluationSection.Error = Error;

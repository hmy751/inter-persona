'use client';

import Text from '@repo/ui/Text';
import styles from './ScoreSection.module.css';
import ProgressBar from './ProgressBar';
import { useGetResult } from '@/_data/result';
import { useParams } from 'next/navigation';
import { ErrorFallbackProps } from '@/_components/layout/error/ErrorBoundary';
import Button from '@repo/ui/Button';

function ScoreSection(): React.ReactElement {
  const resultId = Number(useParams().resultId);
  const { data } = useGetResult(resultId);

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

function Loading() {
  return (
    <div className={styles.container}>
      <div className={`${styles.wrapper} ${styles.skeleton}`}>
        <div className={styles.scoreWrapper}>
          <div className={styles.skeletonText} style={{ width: '50px' }} />
          <div className={styles.skeletonText} style={{ width: '40px', height: '24px' }} />
        </div>
        <div className={styles.scoreWrapper}>
          <div className={styles.skeletonText} style={{ width: '80px' }} />
          <div className={styles.skeletonText} style={{ width: '20px', height: '24px' }} />
        </div>
      </div>
      <div className={`${styles.skeletonProgressBar} ${styles.skeleton}`} />
    </div>
  );
}

function Error({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className={styles.container}>
      <Text as="p" size="md" color="error">
        점수 정보를 불러오는 데 실패했습니다.
      </Text>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </div>
  );
}

export default ScoreSection;

ScoreSection.Loading = Loading;
ScoreSection.Error = Error;

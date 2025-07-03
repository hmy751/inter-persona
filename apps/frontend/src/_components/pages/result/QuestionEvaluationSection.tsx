'use client';

import Text from '@repo/ui/Text';
import styles from './QuestionEvaluationSection.module.css';
import { useGetResult } from '@/_data/result';
import { useParams } from 'next/navigation';
import { ErrorFallbackProps } from '@/_components/layout/error/ErrorBoundary';
import Button from '@repo/ui/Button';

function QuestionEvaluationSection(): React.ReactElement {
  const resultId = Number(useParams().resultId);
  const { data } = useGetResult(resultId);

  return (
    <div className={styles.wrapper}>
      <Text as="h3" size="md">
        Question Evaluation
      </Text>
      {data?.contentFeedback.map(({ question, feedback }, index) => (
        <div className={styles.question} key={question}>
          <div className={styles.questionHeader}>
            <Text size="sm" weight="bold">
              {index + 1}. {question}
            </Text>
          </div>
          <Text size="sm">{feedback}</Text>
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
        <div className={styles.question} key={index}>
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
        질문별 평가를 불러오는 데 실패했습니다.
      </Text>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </div>
  );
}

export default QuestionEvaluationSection;

QuestionEvaluationSection.Loading = Loading;
QuestionEvaluationSection.Error = Error;

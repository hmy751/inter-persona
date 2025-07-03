'use client';

import { Suspense } from 'react';
import styles from './page.module.css';
import Text from '@repo/ui/Text';
import ScoreSection from '@/_components/pages/result/ScoreSection';
import TotalEvaluationSection from '@/_components/pages/result/TotalEvaluationSection';
import QuestionEvaluationSection from '@/_components/pages/result/QuestionEvaluationSection';
import ButtonGroupSection from '@/_components/pages/result/ButtonGroupSection';
import { useRouter, useParams } from 'next/navigation';
import { AppError } from '@/_libs/error/errors';
import ResultGtmLogger from '@/_components/pages/result/ResultGtmLogger';
import { ErrorBoundary, ErrorFallbackProps } from '@/_components/layout/error/ErrorBoundary';
import Button from '@repo/ui/Button';
import { resultQueryKeys } from '@/_data/result';

function ResultErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div>
      <Text as="p" size="md" color="error">
        결과 정보를 불러오는 데 실패했습니다.
      </Text>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const resultId = Number(Array.isArray(params.resultId) ? params.resultId[0] : params.resultId);

  if (!resultId) {
    throw new AppError({
      message: '인터뷰 결과 조회에 실패했습니다. 다시 시도해주세요.',
      code: 'NOT_FOUND',
      data: {},
      reset: () => {
        router.replace('/interviewer');
      },
    });
  }

  return (
    <div className={styles.container}>
      <ResultGtmLogger />
      <Text as="h2" size="lg" className={styles.title}>
        Interview Result
      </Text>
      <ErrorBoundary
        fallbackRender={ResultErrorFallback}
        resetConfig={{
          queryKeysToRemove: [resultQueryKeys.detail(resultId)],
        }}
      >
        <Suspense
          fallback={
            <>
              <ScoreSection.Loading />
              <TotalEvaluationSection.Loading />
              <QuestionEvaluationSection.Loading />
            </>
          }
        >
          <ScoreSection />
          <TotalEvaluationSection />
          <QuestionEvaluationSection />
        </Suspense>
      </ErrorBoundary>
      <ButtonGroupSection />
    </div>
  );
}

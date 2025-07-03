'use client';

import styles from './page.module.css';
import Text from '@repo/ui/Text';
import ScoreSection from '@/_components/pages/result/ScoreSection';
import TotalEvaluationSection from '@/_components/pages/result/TotalEvaluationSection';
import QuestionEvaluationSection from '@/_components/pages/result/QuestionEvaluationSection';
import ButtonGroupSection from '@/_components/pages/result/ButtonGroupSection';
import { useRouter, useParams } from 'next/navigation';
import { AppError } from '@/_libs/error/errors';
import ResultGtmLogger from '@/_components/pages/result/ResultGtmLogger';

export default function Page() {
  const router = useRouter();
  const resultId = useParams().resultId;

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
      <ScoreSection />
      <TotalEvaluationSection />
      <QuestionEvaluationSection />
      <ButtonGroupSection />
    </div>
  );
}

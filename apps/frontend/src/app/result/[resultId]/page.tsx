'use client';

import styles from './page.module.css';

import Text from '@repo/ui/Text';
import ScoreSection from '@/_components/pages/result/ScoreSection';
import TotalEvaluationSection from '@/_components/pages/result/TotalEvaluationSection';
import QuestionEvaluationSection from '@/_components/pages/result/QuestionEvaluationSection';
import ButtonGroupSection from '@/_components/pages/result/ButtonGroupSection';
import { useGetResult } from '@/_data/result';
import { useRouter } from 'next/navigation';
import { APIError } from '@/_apis/fetcher';

export default function Page() {
  const router = useRouter();
  const { data, isLoading, error } = useGetResult();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    throw new APIError('인터뷰 결과 조회에 실패했습니다. 다시 시도해주세요.', 404, 'NOT_FOUND', error, () => {
      router.replace('/interviewer');
    });
  }

  return (
    <div className={styles.container}>
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

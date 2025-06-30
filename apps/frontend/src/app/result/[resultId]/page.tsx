'use client';

import { useEffect } from 'react';
import styles from './page.module.css';
import Text from '@repo/ui/Text';
import ScoreSection from '@/_components/pages/result/ScoreSection';
import TotalEvaluationSection from '@/_components/pages/result/TotalEvaluationSection';
import QuestionEvaluationSection from '@/_components/pages/result/QuestionEvaluationSection';
import ButtonGroupSection from '@/_components/pages/result/ButtonGroupSection';
import { useGetResult } from '@/_data/result';
import { useRouter, useParams } from 'next/navigation';
import { APIError } from '@/_libs/error/errors';
import { GTMViewResults } from '@/_libs/utils/analysis/result';
import { getSessionId } from '@/_libs/utils/session';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';

export default function Page() {
  const router = useRouter();
  const resultId = useParams().resultId;

  const { isLoading, error, data } = useGetResult(Number(resultId));

  useEffect(() => {
    GTMViewResults({
      result_id: resultId as string,
      interview_id: data?.interview.id.toString() || '',
      user_id: data?.user.id.toString() || '',
      session_id: getSessionId() || '',
      funnel_id: useFunnelIdStore.getState().funnelId || '',
    });
  }, [resultId, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!resultId || error) {
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

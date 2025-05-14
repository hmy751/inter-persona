'use client';

import Button from '@repo/ui/Button';
import styles from './ButtonGroupSection.module.css';
import { useRouter, useParams } from 'next/navigation';
import { useGetResult } from '@/_data/result';
import { useCreateInterview } from '@/_data/interview';
import { useQueryClient } from '@tanstack/react-query';

export default function ButtonGroupSection(): React.ReactElement {
  const router = useRouter();
  const resultId = useParams().resultId;
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetResult(Number(resultId));
  const { mutate, isPending } = useCreateInterview(
    data?.userId ?? 0,
    data?.interviewerId ?? 0,
    data?.interview?.category ?? ''
  );

  const handleClickRetryInterview = async () => {
    if (error || isLoading) {
      return;
    }

    mutate();

    queryClient.invalidateQueries({ queryKey: ['result'] });
    queryClient.invalidateQueries({ queryKey: ['interview'] });
  };

  const handleClickSelectInterviewer = () => {
    router.push('/interviewer');

    queryClient.invalidateQueries({ queryKey: ['result'] });
    queryClient.invalidateQueries({ queryKey: ['interview'] });
  };

  return (
    <div className={styles.wrapper}>
      <Button variant="outline" fullWidth onClick={handleClickRetryInterview} isLoading={isPending}>
        문제 다시 풀기
      </Button>
      <Button variant="primary" fullWidth onClick={handleClickSelectInterviewer}>
        면접관 선택 하기
      </Button>
    </div>
  );
}

'use client';

import Button from '@repo/ui/Button';
import styles from './ButtonGroupSection.module.css';
import { useRouter, useParams } from 'next/navigation';
import { useGetResult } from '@/_data/result';
import { useCreateInterview } from '@/_data/interview';

interface ButtonGroupSectionProps {}

export default function ButtonGroupSection({}: ButtonGroupSectionProps): React.ReactElement {
  const router = useRouter();
  const { data } = useGetResult();

  const { mutate, isPending } = useCreateInterview(data?.userId!, data?.interviewerId!);

  const handleClickRetryInterview = async () => {
    mutate();
  };

  const handleClickSelectInterviewer = () => {
    router.push('/interviewer');
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

'use client';

import styles from './chat.module.css';
import Avatar from '@repo/ui/Avatar';
import Text from '@repo/ui/Text';
import { useParams } from 'next/navigation';
import { useSuspenseGetInterviewInterviewer } from '@/_data/interview';
import { ErrorFallbackProps } from '@/_components/layout/error/ErrorBoundary';
import Button from '@repo/ui/Button';

function Loading() {
  return (
    <section className={styles.profileContainer}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.profileInfo}>
        <div className={styles.skeletonText} style={{ width: '50%' }} />
        <div className={styles.skeletonText} style={{ width: '80%' }} />
      </div>
    </section>
  );
}

function Error({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <section className={styles.profileContainer}>
      <Text as="p" size="md" color="error">
        면접관 정보를 불러오는 데 실패했습니다.
      </Text>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </section>
  );
}

export default function InterviewerProfileSection() {
  const { interviewId } = useParams();

  const { data } = useSuspenseGetInterviewInterviewer(Number(interviewId));

  return (
    <section className={styles.profileContainer}>
      <Avatar src={data?.interviewer.profileImageUrl ?? ''} size="xl" />
      <div className={styles.profileInfo}>
        <Text as="p" size="md">
          {data?.interviewer.name}
        </Text>
        <Text as="p" size="sm">
          {data?.interviewer.description}
        </Text>
      </div>
    </section>
  );
}

InterviewerProfileSection.Loading = Loading;
InterviewerProfileSection.Error = Error;

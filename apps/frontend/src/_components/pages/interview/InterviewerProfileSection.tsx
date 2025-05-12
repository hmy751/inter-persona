'use client';

import styles from './chat.module.css';
import Avatar from '@repo/ui/Avatar';
import Text from '@repo/ui/Text';
import { useParams } from 'next/navigation';
import { useGetInterviewInterviewer } from '@/_data/interview';

interface InterviewerProfileSectionProps {}

export default function InterviewerProfileSection({}: InterviewerProfileSectionProps) {
  const { interviewId } = useParams();

  const { data, isLoading, isError } = useGetInterviewInterviewer(Number(interviewId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || isError) {
    return <div>No data</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <Avatar src={data?.interviewer.profileImageUrl ?? ''} size="xl" />
      <div className={styles.profileInfo}>
        <Text as="p" size="md">
          {data?.interviewer.name}
        </Text>
        <Text as="p" size="sm">
          {data?.interviewer.description}
        </Text>
      </div>
    </div>
  );
}

'use client';

import InterviewerCard from '@/_components/pages/interviewer/InterviewerCard';
import styles from './page.module.css';
import Text from '@repo/ui/Text';
import { useGetInterviewerList } from '@/_data/interviewer';
import { APIError } from '@/_libs/error/errors';

export default function InterviewerChoicePage() {
  const { data, isLoading, error } = useGetInterviewerList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    throw new APIError({
      message: '인터뷰어 목록 조회에 실패했습니다. 다시 시도해주세요.',
      status: 404,
      code: 'NOT_FOUND',
      data: error,
    });
  }

  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" align="center" className={styles.title}>
        Select Interviewer
      </Text>
      {data?.map(interviewer => (
        <InterviewerCard
          id={interviewer.id}
          key={interviewer.id}
          imgUrl={interviewer.profileImageUrl}
          name={interviewer.name}
          mbti={interviewer.persona.mbti}
          description={interviewer.description}
        />
      ))}
    </div>
  );
}

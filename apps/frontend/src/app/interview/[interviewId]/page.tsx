'use client';

import InterviewerProfileSection from '@/_components/pages/interview/InterviewerProfileSection';
import styles from './page.module.css';
import Text from '@repo/ui/Text';
import ChatSection from '@/_components/pages/interview/ChatSection';
import { useRouter } from 'next/navigation';
import { useGetInterview } from '@/_data/interview';
import { APIError } from '@/_apis/fetcher';

export default function Page({ params }: { params: { interviewId: string } }) {
  const interviewId = Number(params.interviewId);
  const router = useRouter();

  const { data, error, isLoading } = useGetInterview(interviewId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.interviewerId && data?.userId) {
    throw new APIError('인터뷰어를 찾지 못했습니다. 다시 선택해주세요.', 404, 'NOT_FOUND', error, () => {
      router.replace('/interviewer');
    });
  }

  if (!data?.userId && data?.interviewerId) {
    throw new APIError('유저정보를 찾지 못했습니다. 다시 로그인해주세요.', 404, 'NOT_FOUND', error, () => {
      router.replace('/');
    });
  }

  if (error) {
    throw new APIError('인터뷰 조회에 실패했습니다. 다시 시도해주세요.', 404, 'NOT_FOUND', error, () => {
      router.replace('/');
    });
  }

  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" className={styles.title}>
        Interview
      </Text>
      <InterviewerProfileSection />
      <ChatSection />
    </div>
  );
}

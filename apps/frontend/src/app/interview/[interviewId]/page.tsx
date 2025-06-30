'use client';

import InterviewerProfileSection from '@/_components/pages/interview/InterviewerProfileSection';
import styles from './page.module.css';
import Text from '@repo/ui/Text';
import ChatSection from '@/_components/pages/interview/ChatSection';
import { useRouter } from 'next/navigation';
import { APIError } from '@/_libs/error/errors';

export default function Page({ params }: { params: { interviewId: string } }) {
  const interviewId = Number(params.interviewId);
  const router = useRouter();

  if (!interviewId) {
    throw new APIError({
      message: '인터뷰 조회에 실패했습니다. 다시 시도해주세요.',
      status: 404,
      code: 'NOT_FOUND',
      data: {},
      reset: () => {
        router.replace('/');
      },
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

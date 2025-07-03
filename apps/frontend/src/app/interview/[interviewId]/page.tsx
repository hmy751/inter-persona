'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/_components/layout/error/ErrorBoundary';
import InterviewerProfileSection from '@/_components/pages/interview/InterviewerProfileSection';
import styles from './page.module.css';
import Text from '@repo/ui/Text';
import ChatSection from '@/_components/pages/interview/ChatSection';
import { useRouter } from 'next/navigation';
import { AppError } from '@/_libs/error/errors';
import { interviewQueryKeys } from '@/_data/interview';

export default function Page({ params }: { params: { interviewId: string } }) {
  const interviewId = Number(params.interviewId);
  const router = useRouter();

  if (!interviewId) {
    throw new AppError({
      message: '해당 인터뷰가 없습니다. 다시 시도해주세요.',
      code: 'NOT_FOUND',
      data: {},
      reset: () => {
        router.replace('/');
      },
    });
  }

  const resetQueryKeys = [interviewQueryKeys.interviewer(interviewId)];

  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" className={styles.title}>
        Interview
      </Text>

      <ErrorBoundary
        fallbackRender={InterviewerProfileSection.Error}
        resetConfig={{
          queryKeysToRemove: resetQueryKeys,
        }}
      >
        <Suspense fallback={<InterviewerProfileSection.Loading />}>
          <InterviewerProfileSection />
        </Suspense>
      </ErrorBoundary>
      <ChatSection />
    </div>
  );
}

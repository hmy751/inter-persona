'use client';

import { Suspense } from 'react';
import styles from './page.module.css';
import Text from '@repo/ui/Text';
import InterviewerSection, { resetQueryKeys } from '@/_components/pages/interviewer/interviewerSection';
import { ErrorBoundary } from '@/_components/layout/error/ErrorBoundary';

export default function InterviewerChoicePage() {
  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" align="center" className={styles.title}>
        Select Interviewer
      </Text>
      <ErrorBoundary
        resetConfig={{
          queryKeysToRemove: resetQueryKeys,
        }}
        fallbackRender={InterviewerSection.Error}
      >
        <Suspense fallback={<InterviewerSection.Loading />}>
          <InterviewerSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

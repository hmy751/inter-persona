'use client';

import { useSuspenseGetInterviewerList, QUERY_KEY } from '@/_data/interviewer';
import InterviewerCard from '@/_components/pages/interviewer/interviewerSection/InterviewerCard';
import Text from '@repo/ui/Text';
import { ErrorFallbackProps } from '@/_components/layout/error/ErrorBoundary';
import Button from '@repo/ui/Button';

function Loading() {
  return (
    <section>
      {Array.from({ length: 3 }).map((_, index) => (
        <InterviewerCard.Loading key={index} />
      ))}
    </section>
  );
}

function Error({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <section>
      <Text as="p" size="lg" color="error">
        면접관 목록을 불러오는데 실패했습니다.
      </Text>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </section>
  );
}

export default function InterviewerSection() {
  const { data } = useSuspenseGetInterviewerList();

  return (
    <section>
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
    </section>
  );
}

InterviewerSection.Loading = Loading;
InterviewerSection.Error = Error;

export const resetQueryKeys = [QUERY_KEY];

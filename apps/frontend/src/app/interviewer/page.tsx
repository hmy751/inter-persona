"use client";

import InterviewerCard from "@/_components/pages/interviewer/InterviewerCard";
import styles from "./page.module.css";
import Text from "@repo/ui/Text";
import { useGetInterviewerList } from "@/_data/interviewer";
import { APIError } from "@/_apis/fetcher";

export default function InterviewerChoicePage() {
  const { data, isLoading, error } = useGetInterviewerList();

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    throw new APIError(
      "인터뷰어 목록 조회에 실패했습니다. 다시 시도해주세요.",
      404,
      "NOT_FOUND",
      error
    );
  }

  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" align="center" className={styles.title}>
        Select Interviewer
      </Text>
      {data?.list.map((interviewer, index) => (
        <InterviewerCard
          id={interviewer.id}
          key={interviewer.id}
          imgUrl={interviewer.imgUrl}
          name={interviewer.name}
          mbti={interviewer.mbti}
          description={interviewer.description}
        />
      ))}
    </div>
  );
}

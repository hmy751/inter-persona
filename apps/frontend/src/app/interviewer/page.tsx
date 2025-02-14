"use client";

import InterviewerCard from "@/_components/pages/interviewer/InterviewerCard";
import styles from "./page.module.css";
import Text from "@repo/ui/Text";
import { fetchInterviewer } from "@/_apis/interviewer";
import { useQuery } from "@tanstack/react-query";

export default function InterviewerChoicePage() {
  const { data } = useQuery({
    queryKey: ["interviewer"],
    queryFn: fetchInterviewer,
  });

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

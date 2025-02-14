"use client";

import styles from "./chat.module.css";
import Avatar from "@repo/ui/Avatar";
import Text from "@repo/ui/Text";
import { useQuery } from "@tanstack/react-query";
import { fetchGetInterviewInterviewer } from "@/_apis/interview";
import { useParams } from "next/navigation";

interface InterviewerProfileSectionProps {}

export default function InterviewerProfileSection({}: InterviewerProfileSectionProps) {
  const { interviewId } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["interview/interviewer", interviewId],
    queryFn: () =>
      fetchGetInterviewInterviewer({ interviewId: Number(interviewId) }),
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data || isError) return <div>No data</div>;

  return (
    <div className={styles.profileContainer}>
      <Avatar src={data?.interviewer.imgUrl ?? ""} size="md" />
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

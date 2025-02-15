"use client";

import InterviewerProfileSection from "@/_components/pages/interview/InterviewerProfileSection";
import styles from "./page.module.css";
import Text from "@repo/ui/Text";
import ChatSection from "@/_components/pages/interview/ChatSection";
import { useParams, useRouter } from "next/navigation";
import { useGetInterview } from "@/_data/interview";
import { useAlertDialogStore } from "@repo/store/useAlertDialogStore";

export default function Page({ params }: { params: { interviewId: string } }) {
  const interviewId = Number(params.interviewId);
  const router = useRouter();
  const { setAlert } = useAlertDialogStore();

  const { data, error, isLoading } = useGetInterview(interviewId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.interviewerId || !data?.userId || error) {
    setAlert(
      "인터뷰 조회 실패",
      "인터뷰 조회에 실패했습니다. 다시 시도해주세요."
    );
    router.push("/");
    return null;
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

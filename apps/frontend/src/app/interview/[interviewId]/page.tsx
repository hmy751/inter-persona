"use client";

import InterviewerProfileSection from "@/_components/pages/interview/InterviewerProfileSection";
import styles from "./page.module.css";
import Text from "@repo/ui/Text";
import ChatSection from "@/_components/pages/interview/ChatSection";
import useUserStore from "@/_store/zustand/useUserStore";
import { useInterviewerStore } from "@/_store/zustand/useInterviewerStore";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const { interviewer } = useInterviewerStore();
  const { user } = useUserStore();

  if (!user || !interviewer) {
    router.back();
    return null;
  }

  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" className={styles.title}>
        Interview
      </Text>
      <InterviewerProfileSection
        src={interviewer?.imgUrl}
        name={interviewer?.name}
        description={interviewer?.description}
      />
      <ChatSection
        interviewerImg={interviewer?.imgUrl || ""}
        userImg={user?.imageSrc || ""}
      />
    </div>
  );
}

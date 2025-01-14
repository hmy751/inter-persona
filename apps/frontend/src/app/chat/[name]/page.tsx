"use client";

import InterviewerProfileSection from "./_components/InterviewerProfileSection";
import styles from "./page.module.css";
import Text from "@repo/ui/Text";
import ChatSection from "./_components/ChatSection";
import useUserStore from "@/store/useUserStore";
import { useInterviewerStore } from "@/store/useInterviewerStore";
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

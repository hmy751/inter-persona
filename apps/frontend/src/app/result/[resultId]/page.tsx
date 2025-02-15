"use client";

import styles from "./page.module.css";

import Text from "@repo/ui/Text";
import ScoreSection from "@/_components/pages/result/ScoreSection";
import TotalEvaluationSection from "@/_components/pages/result/TotalEvaluationSection";
import QuestionEvaluationSection from "@/_components/pages/result/QuestionEvaluationSection";
import ButtonGroupSection from "@/_components/pages/result/ButtonGroupSection";
import { useGetResult } from "@/_data/result";
import { useRouter } from "next/navigation";
import { useAlertDialogStore } from "@repo/store/useAlertDialogStore";

export default function Page() {
  const router = useRouter();
  const { setAlert } = useAlertDialogStore();
  const { data, isLoading, error } = useGetResult();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    setAlert(
      "인터뷰 결과 조회 실패",
      "인터뷰 결과 조회에 실패했습니다. 다시 인터뷰를 시도해주세요."
    );
    router.push("/interviewer");
    return null;
  }

  return (
    <div className={styles.container}>
      <Text as="h2" size="lg" className={styles.title}>
        Interview Result
      </Text>
      <ScoreSection />
      <TotalEvaluationSection />
      <QuestionEvaluationSection />
      <ButtonGroupSection />
    </div>
  );
}

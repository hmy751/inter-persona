"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./page.module.css";

import { useQuery } from "@tanstack/react-query";
import { selectInterviewId } from "@/_store/redux/features/chat/selector";
import { useInterviewerStore } from "@/_store/zustand/useInterviewerStore";
import Text from "@repo/ui/Text";
import ScoreSection from "@/_components/pages/result/ScoreSection";
import TotalEvaluationSection from "@/_components/pages/result/TotalEvaluationSection";
import QuestionEvaluationSection from "@/_components/pages/result/QuestionEvaluationSection";
import ButtonGroupSection from "@/_components/pages/result/ButtonGroupSection";
import { fetchGetResult } from "@/_apis/result";
import { useParams, useRouter } from "next/navigation";
import { useAlertDialogStore } from "@repo/store/useAlertDialogStore";
interface Scores {
  standard: string;
  score: number;
  summary: string;
}

export default function Page() {
  const { resultId } = useParams();
  const router = useRouter();
  const { setAlert } = useAlertDialogStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["result", resultId],
    queryFn: () => fetchGetResult({ resultId: Number(resultId) }),
  });

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

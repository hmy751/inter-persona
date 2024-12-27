"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./page.module.css";

import InterviewerProfile from "./_components/InterviewerProfile";
import { useQuery } from "@tanstack/react-query";
import { selectChatId } from "@/store/redux/features/chat/selector";
import { useInterviewerStore } from "@/store/useInterviewerStore";
import Text from "@repo/ui/Text";
import ScoreSection from "./_components/ScoreSection";
import TotalEvaluationSection from "./_components/TotalEvaluationSection";
import QuestionEvaluationSection from "./_components/QuestionEvaluationSection";
import ButtonGroupSection from "./_components/ButtonGroupSection";

interface Scores {
  standard: string;
  score: number;
  summary: string;
}

export default function Page() {
  const chatId = useSelector(selectChatId) ?? 2;
  const { interviewer } = useInterviewerStore();

  const { data, isLoading } = useQuery<{
    scores: Scores[];
    finalEvaluation: string;
  }>({
    queryKey: ["result", chatId],
    queryFn: () => {
      return fetch(`http://localhost:3030/interview/${chatId}/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    },
  });

  const reviewerName = "엘론 머스크";

  const totalScore: number = useMemo(() => {
    if (!data?.scores) {
      return 0;
    }

    return data.scores.reduce((acc, { score }) => acc + score, 0);
  }, [data]);

  return (
    <div className={styles.container}>
      <Text as="h2" size="lg">
        Interview Result
      </Text>
      <ScoreSection />
      <TotalEvaluationSection />
      <QuestionEvaluationSection />
      <ButtonGroupSection />
    </div>
  );
}

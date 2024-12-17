"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./page.module.css";

import InterviewerProfile from "./_components/InterviewerProfile";
import { useQuery } from "@tanstack/react-query";
import { selectChatId } from "@/store/redux/features/chat/selector";
import { useInterviewerStore } from "@/store/useInterviewerStore";

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
      {isLoading ? (
        <>
          <div className={styles.profileWrapper}>
            <InterviewerProfile
              src={interviewer?.imgUrl}
              name={interviewer?.name}
              description={interviewer?.description}
            />
          </div>
          <div className={styles.loadingContainer}>
            <div className={styles.reviewerName}>{reviewerName}는 평가 중</div>
            <div className={styles.spinner} />
          </div>
        </>
      ) : (
        <div className={styles.resultContainer}>
          <div className={styles.scoreWrapper}>
            <div className={styles.reviewerName}>
              {reviewerName}가 평가한 당신은
            </div>
            <div>
              <span className={styles.score}>{totalScore}</span>
              <span className={styles.scoreUnit}>점</span>
            </div>
          </div>

          <div className={styles.scoreCardContainer}>
            {data?.scores?.map(({ standard, score, summary }, index) => (
              <div key={standard} className={styles.scoreCard}>
                <div className={styles.scoreCardContent}>
                  <div className={styles.scoreCircle}>{score}</div>
                  <div className={styles.scoreCardTextContainer}>
                    <div className={styles.scoreCardTitle}>{standard}</div>
                    <div className={styles.scoreCardSummary}>{summary}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.finalEvaluation}>
            <div className={styles.finalEvaluationTitle}>
              {reviewerName}의 한마디
            </div>
            <br />
            {data?.finalEvaluation}
          </div>
        </div>
      )}
    </div>
  );
}

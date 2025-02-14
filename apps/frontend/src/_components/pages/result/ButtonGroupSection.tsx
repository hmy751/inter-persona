"use client";

import Button from "@repo/ui/Button";
import styles from "./ButtonGroupSection.module.css";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchGetResult } from "@/_apis/result";
import { useMutation } from "@tanstack/react-query";
import { delay } from "@/_libs/utils";
import { fetchCreateInterview } from "@/_apis/interview";
import { APIError } from "@/_apis/fetcher";
import useToastStore from "@repo/store/useToastStore";

interface ButtonGroupSectionProps {}

export default function ButtonGroupSection({}: ButtonGroupSectionProps): React.ReactElement {
  const router = useRouter();
  const { resultId } = useParams();
  const { data } = useQuery({
    queryKey: ["result", resultId],
    queryFn: () => fetchGetResult({ resultId: Number(resultId) }),
  });
  const addToast = useToastStore((state) => state.addToast);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await delay(500);

      return await fetchCreateInterview({
        interviewerId: data?.interviewerId!,
        userId: data?.userId!,
      });
    },
    onSuccess: (data) => {
      if (!data?.id) {
        addToast({
          title: "인터뷰 생성 실패",
          description: "인터뷰 생성에 실패했습니다. 다시 시도해주세요.",
        });
        return;
      }

      router.push(`/interview/${data.id}`);
    },
    onError: (error) => {
      if (error instanceof APIError) {
        addToast({
          title: "인터뷰 생성 실패",
          description: error.message,
        });
        return;
      }

      addToast({
        title: "인터뷰 생성 실패",
        description: "인터뷰 생성에 실패했습니다. 다시 시도해주세요.",
      });
    },
  });

  const handleClickRetryInterview = async () => {
    mutate();
  };

  const handleClickSelectInterviewer = () => {
    router.push("/interviewer");
  };

  return (
    <div className={styles.wrapper}>
      <Button
        variant="outline"
        fullWidth
        onClick={handleClickRetryInterview}
        isLoading={isPending}
      >
        문제 다시 풀기
      </Button>
      <Button
        variant="primary"
        fullWidth
        onClick={handleClickSelectInterviewer}
      >
        면접관 선택 하기
      </Button>
    </div>
  );
}

"use client";

import Button from "@repo/ui/Button";
import { useRouter } from "next/navigation";
import { fetchCreateInterview } from "@/_apis/interview";
import useUserStore from "@/_store/zustand/useUserStore";
import { useMutation } from "@tanstack/react-query";
import useToastStore from "@repo/store/useToastStore";
import { APIError } from "@/_apis/fetcher";
import useConfirmDialogStore from "@repo/store/useConfirmDialogStore";
import { delay } from "@/_libs/utils";
interface StartInterviewButtonProps {
  id: number;
}

export default function StartInterviewButton({
  id: interviewerId,
}: StartInterviewButtonProps): React.ReactElement {
  const router = useRouter();
  const userId = useUserStore((state) => state?.user?.id);
  const addToast = useToastStore((state) => state.addToast);
  const setConfirm = useConfirmDialogStore((state) => state.setConfirm);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await delay(500);

      return await fetchCreateInterview({
        interviewerId,
        userId: userId!,
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

  const handleClick = async () => {
    if (!userId) {
      setConfirm(
        "유저 정보 필요",
        "인터뷰를 시작하려면 로그인해주세요.",
        () => {
          router.push("/main");
        }
      );
      return;
    }

    mutate();
  };

  return (
    <Button
      variant="outline"
      size="md"
      onClick={handleClick}
      disabled={isPending}
      isLoading={isPending}
    >
      Start interview
    </Button>
  );
}

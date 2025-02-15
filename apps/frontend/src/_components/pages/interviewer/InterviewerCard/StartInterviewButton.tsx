"use client";

import Button from "@repo/ui/Button";
import { useRouter } from "next/navigation";
import useUserStore from "@/_store/zustand/useUserStore";
import { useCreateInterview } from "@/_data/interview";
import useConfirmDialogStore from "@repo/store/useConfirmDialogStore";
interface StartInterviewButtonProps {
  id: number;
}

export default function StartInterviewButton({
  id: interviewerId,
}: StartInterviewButtonProps): React.ReactElement {
  const router = useRouter();
  const userId = useUserStore((state) => state?.user?.id);
  const setConfirm = useConfirmDialogStore((state) => state.setConfirm);

  const { mutate, isPending } = useCreateInterview(userId!, interviewerId);

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

"use client";

import Button from "@repo/ui/Button";
import { useInterviewerStore } from "@/_store/zustand/useInterviewerStore";
import { useRouter } from "next/navigation";

interface StartInterviewButtonProps {
  id: number;
}

export default function StartInterviewButton({
  id,
}: StartInterviewButtonProps): React.ReactElement {
  const setInterviewerId = useInterviewerStore(
    (state) => state.setInterviewerId
  );
  const router = useRouter();
  const handleClick = () => {
    setInterviewerId(id);
    router.push(`/interview`);
  };
  return (
    <Button variant="outline" size="md" onClick={handleClick}>
      Start interview
    </Button>
  );
}

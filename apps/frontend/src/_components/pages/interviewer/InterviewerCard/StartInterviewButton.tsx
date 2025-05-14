'use client';

import Button from '@repo/ui/Button';
import { useRouter } from 'next/navigation';
import { useCreateInterview } from '@/_data/interview';
import useConfirmDialogStore from '@repo/store/useConfirmDialogStore';
import { useGetUser } from '@/_data/user';

interface StartInterviewButtonProps {
  id: number;
  category: string;
}

export default function StartInterviewButton({
  id: interviewerId,
  category,
}: StartInterviewButtonProps): React.ReactElement {
  const router = useRouter();
  const { data: user } = useGetUser();
  const userId = user?.id;
  const setConfirm = useConfirmDialogStore(state => state.setConfirm);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { mutate, isPending } = useCreateInterview(userId!, interviewerId, category);

  const handleClick = async () => {
    if (!userId) {
      setConfirm('유저 정보 필요', '인터뷰를 시작하려면 로그인해주세요.', () => {
        router.push('/main');
      });
      return;
    }

    mutate();
  };

  return (
    <Button variant="outline" size="md" onClick={handleClick} disabled={isPending} isLoading={isPending}>
      Start interview
    </Button>
  );
}

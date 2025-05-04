import { useMutation, useQuery } from '@tanstack/react-query';
import { delay } from '@/_libs/utils';
import {
  fetchCreateInterview,
  fetchGetInterview,
  fetchGetInterviewInterviewer,
  fetchGetInterviewUser,
  GetInterviewResponse,
  GetInterviewInterviewerResponse,
  GetInterviewUserResponse,
} from '@/_apis/interview';
import { APIError } from '@/_apis/fetcher';
import useToastStore from '@repo/store/useToastStore';
import { useRouter } from 'next/navigation';

// 인터뷰 조회
export const useGetInterview = (interviewId: number) => {
  return useQuery<GetInterviewResponse, APIError>({
    queryKey: ['interview', interviewId],
    queryFn: () => fetchGetInterview({ interviewId }),
    enabled: !!interviewId,
  });
};

// 인터뷰 생성
export const useCreateInterview = (userId: number, interviewerId: number) => {
  const router = useRouter();
  const addToast = useToastStore(state => state.addToast);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await delay(500);

      return await fetchCreateInterview({
        interviewerId,
        userId,
      });
    },
    onSuccess: data => {
      if (!data?.id) {
        addToast({
          title: '인터뷰 생성 실패',
          description: '인터뷰 생성에 실패했습니다. 다시 시도해주세요.',
        });
        return;
      }

      router.push(`/interview/${data.id}`);
    },
    onError: error => {
      if (error instanceof APIError) {
        addToast({
          title: '인터뷰 생성 실패',
          description: error.message,
        });
        return;
      }

      addToast({
        title: '인터뷰 생성 실패',
        description: '인터뷰 생성에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  return { mutate, isPending };
};

// 인터뷰, 인터뷰어 조회
export const useGetInterviewInterviewer = (interviewId: number) => {
  return useQuery<GetInterviewInterviewerResponse, APIError>({
    queryKey: ['interview', interviewId, 'interviewer'],
    queryFn: () => fetchGetInterviewInterviewer({ interviewId }),
    enabled: !!interviewId,
  });
};

// 인터뷰, 유저 조회
export const useGetInterviewUser = (interviewId: number) => {
  return useQuery<GetInterviewUserResponse, APIError>({
    queryKey: ['interview', interviewId, 'user'],
    queryFn: () => fetchGetInterviewUser({ interviewId }),
    enabled: !!interviewId,
  });
};

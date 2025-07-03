import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { delay } from '@/_libs/utils';
import {
  fetchCreateInterview,
  fetchGetInterviewContents,
  fetchGetInterviewInterviewer,
  fetchGetInterviewUser,
  fetchGetInterviewStatus,
  GetInterviewInterviewerResponse,
  GetInterviewUserResponse,
  GetInterviewContentsResponse,
  GetInterviewStatusResponse,
  fetchGetInterview,
  GetInterviewResponse,
} from '@/_apis/interview';
import { APIError } from '@/_libs/error/errors';
import useToastStore from '@repo/store/useToastStore';
import { useRouter } from 'next/navigation';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';
import { GTMInterviewerSelectedSuccess, GTMInterviewerSelectedFailed } from '@/_libs/utils/analysis/interviewer';
import { getSessionId } from '@/_libs/utils/session';

export const interviewQueryKeys = {
  base: ['interview'] as const,
  detail: (interviewId: number) => [...interviewQueryKeys.base, interviewId] as const,
  contents: (interviewId: number) => [...interviewQueryKeys.detail(interviewId), 'contents'] as const,
  interviewer: (interviewId: number) => [...interviewQueryKeys.detail(interviewId), 'interviewer'] as const,
  user: (interviewId: number) => [...interviewQueryKeys.detail(interviewId), 'user'] as const,
  status: (interviewId: number) => [...interviewQueryKeys.detail(interviewId), 'status'] as const,
};

export const useGetInterview = (interviewId: number) => {
  return useSuspenseQuery<GetInterviewResponse, APIError>({
    queryKey: interviewQueryKeys.detail(interviewId),
    queryFn: () => fetchGetInterview({ interviewId }),
  });
};

// 인터뷰 컨텐츠 조회
export const useGetInterviewContents = (interviewId: number) => {
  return useQuery<GetInterviewContentsResponse, APIError>({
    queryKey: interviewQueryKeys.contents(interviewId),
    queryFn: () => fetchGetInterviewContents({ interviewId }),
    enabled: !!interviewId,
  });
};

// 인터뷰 생성
export const useCreateInterview = (userId: number, interviewerId: number, category: string) => {
  const router = useRouter();
  const addToast = useToastStore(state => state.addToast);
  const { funnelId } = useFunnelIdStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await delay(500);

      return await fetchCreateInterview({
        interviewerId,
        userId,
        category,
      });
    },
    onSuccess: data => {
      if (!data?.interviewId) {
        GTMInterviewerSelectedFailed({
          user_id: userId.toString(),
          interviewer_id: interviewerId.toString(),
          session_id: getSessionId(),
          funnel_id: funnelId || '',
          category,
          message: '요청 성공, 응답 데이터 검증 실패',
        });

        addToast({
          title: '인터뷰 생성 실패',
          description: '인터뷰 생성에 실패했습니다. 다시 시도해주세요.',
        });
        return;
      }

      GTMInterviewerSelectedSuccess({
        user_id: userId.toString(),
        interviewer_id: interviewerId.toString(),
        session_id: getSessionId(),
        funnel_id: funnelId || '',
        category,
      });

      router.push(`/interview/${data.interviewId}`);
    },
    onError: error => {
      if (error instanceof APIError) {
        GTMInterviewerSelectedFailed({
          user_id: userId.toString(),
          interviewer_id: interviewerId.toString(),
          session_id: getSessionId(),
          funnel_id: funnelId || '',
          category,
          message: error.message,
        });

        addToast({
          title: '인터뷰 생성 실패',
          description: error.message,
        });
        return;
      }

      GTMInterviewerSelectedFailed({
        user_id: userId.toString(),
        interviewer_id: interviewerId.toString(),
        session_id: getSessionId(),
        funnel_id: funnelId || '',
        category,
        message: error.message,
      });

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
    queryKey: interviewQueryKeys.interviewer(interviewId),
    queryFn: () => fetchGetInterviewInterviewer({ interviewId }),
    enabled: !!interviewId,
  });
};

export const useSuspenseGetInterviewInterviewer = (interviewId: number) => {
  return useSuspenseQuery<GetInterviewInterviewerResponse, APIError>({
    queryKey: interviewQueryKeys.interviewer(interviewId),
    queryFn: () => fetchGetInterviewInterviewer({ interviewId }),
  });
};

// 인터뷰, 유저 조회
export const useGetInterviewUser = (interviewId: number) => {
  return useQuery<GetInterviewUserResponse, APIError>({
    queryKey: interviewQueryKeys.user(interviewId),
    queryFn: () => fetchGetInterviewUser({ interviewId }),
    enabled: !!interviewId,
  });
};

// 인터뷰 상태 조회
export const useGetInterviewStatus = (interviewId: number) => {
  return useQuery<GetInterviewStatusResponse, APIError>({
    queryKey: interviewQueryKeys.status(interviewId),
    queryFn: () => fetchGetInterviewStatus({ interviewId }),
  });
};

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchCreateResult,
  fetchGetResult,
  fetchGetResultQuestionEvaluation,
  fetchGetResultScore,
  fetchGetResultTotalEvaluation,
} from '@/_apis/result';
import { useRouter, useParams } from 'next/navigation';
import useToastStore from '@repo/store/useToastStore';
import { APIError } from '@/_apis/fetcher';
import { delay } from '@/_libs/utils';

export const useCreateResult = () => {
  const router = useRouter();
  const interviewId = useParams().interviewId;
  const addToast = useToastStore(state => state.addToast);

  return useMutation({
    mutationFn: async () => {
      await delay(500);

      return await fetchCreateResult({
        interviewId: Number(interviewId),
      });
    },
    onSuccess: data => {
      if (!data?.id) {
        addToast({
          title: '인터뷰 결과 생성 실패',
          description: '인터뷰 결과 생성에 실패했습니다. 다시 시도해주세요.',
        });
        return;
      }

      router.push(`/result/${data.id}`);
    },
    onError: error => {
      if (error instanceof APIError) {
        addToast({
          title: '인터뷰 결과 생성 실패',
          description: error.message,
        });
        return;
      }

      addToast({
        title: '인터뷰 결과 생성 실패',
        description: '인터뷰 결과 생성에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });
};

export const useGetResult = () => {
  const resultId = useParams().resultId;

  return useQuery({
    queryKey: ['result', resultId],
    queryFn: () => fetchGetResult({ resultId: Number(resultId) }),
  });
};

export const useGetResultScore = () => {
  const resultId = useParams().resultId;

  return useQuery({
    queryKey: ['result', resultId, 'score'],
    queryFn: () => fetchGetResultScore({ resultId: Number(resultId) }),
  });
};

export const useGetResultTotalEvaluation = () => {
  const resultId = useParams().resultId;

  return useQuery({
    queryKey: ['result', resultId, 'total'],
    queryFn: () => fetchGetResultTotalEvaluation({ resultId: Number(resultId) }),
  });
};

export const useGetResultQuestionEvaluation = () => {
  const resultId = useParams().resultId;

  return useQuery({
    queryKey: ['result', resultId, 'question'],
    queryFn: () => fetchGetResultQuestionEvaluation({ resultId: Number(resultId) }),
  });
};

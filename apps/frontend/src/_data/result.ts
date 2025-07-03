import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  fetchCreateResult,
  fetchGetResult,
  fetchGetResultQuestionEvaluation,
  fetchGetResultScore,
  fetchGetResultTotalEvaluation,
} from '@/_apis/result';
import { useRouter, useParams } from 'next/navigation';
import useToastStore from '@repo/store/useToastStore';
import { APIError } from '@/_libs/error/errors';

export const resultQueryKeys = {
  base: ['result'] as const,
  detail: (resultId: number) => [...resultQueryKeys.base, resultId] as const,
  score: (resultId: number) => [...resultQueryKeys.detail(resultId), 'score'] as const,
  total: (resultId: number) => [...resultQueryKeys.detail(resultId), 'total'] as const,
  question: (resultId: number) => [...resultQueryKeys.detail(resultId), 'question'] as const,
};

export const useCreateResult = () => {
  const router = useRouter();
  const addToast = useToastStore(state => state.addToast);

  return useMutation({
    mutationFn: async (interviewId: number) => {
      return await fetchCreateResult({
        interviewId,
      });
    },
    onSuccess: data => {
      router.push(`/result/${data.id}`);
    },
    onError: error => {
      if (error instanceof APIError) {
        if (error.status === 409) {
          router.push(`/result/${(error.data as { id: number }).id}`);
          return;
        }

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

export const useGetResult = (resultId: number) => {
  return useSuspenseQuery({
    queryKey: resultQueryKeys.detail(resultId),
    queryFn: () => fetchGetResult({ id: resultId }),
  });
};

export const useGetResultScore = () => {
  const params = useParams();
  const resultId = Array.isArray(params.resultId) ? Number(params.resultId[0]) : Number(params.resultId);

  return useQuery({
    queryKey: resultQueryKeys.score(resultId),
    queryFn: () => fetchGetResultScore({ resultId }),
    enabled: !!resultId,
  });
};

export const useGetResultTotalEvaluation = () => {
  const params = useParams();
  const resultId = Array.isArray(params.resultId) ? Number(params.resultId[0]) : Number(params.resultId);

  return useQuery({
    queryKey: resultQueryKeys.total(resultId),
    queryFn: () => fetchGetResultTotalEvaluation({ resultId }),
    enabled: !!resultId,
  });
};

export const useGetResultQuestionEvaluation = () => {
  const params = useParams();
  const resultId = Array.isArray(params.resultId) ? Number(params.resultId[0]) : Number(params.resultId);

  return useQuery({
    queryKey: resultQueryKeys.question(resultId),
    queryFn: () => fetchGetResultQuestionEvaluation({ resultId }),
    enabled: !!resultId,
  });
};

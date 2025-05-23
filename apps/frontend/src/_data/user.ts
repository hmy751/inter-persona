import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchUserInfo } from '@/_apis/user';
import { UserInfoResponseSchema } from '@repo/schema/user';
import { APIError } from '@/_apis/fetcher';

type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>;

export const useGetUser = () => {
  return useQuery<UserInfoResponse>({
    queryKey: ['user', 'info'],
    queryFn: async () => {
      const response = await fetchUserInfo();
      const parsedData = UserInfoResponseSchema.safeParse(response);

      if (parsedData.success) {
        return parsedData.data;
      } else {
        throw new APIError('회원 정보 조회에 실패했습니다. 다시 시도해주세요.', 404, 'NOT_FOUND', parsedData.error);
      }
    },
  });
};

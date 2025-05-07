import fetcher from './fetcher';
import { RegisterResponseSchema } from '@repo/schema/user';
import { z } from 'zod';

// 로그인
export interface LoginBody {
  email: string;
  password: string;
}
interface LoginResponse {
  id: number;
  name: string;
  email: string;
  imageSrc: string;
}

export const fetchLogin = async ({ email, password }: LoginBody) => {
  return fetcher.post<LoginResponse>('login', {
    email,
    password,
  });
};

// 회원가입
type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

export const fetchRegister = async (formData: FormData) => {
  return fetcher.post<RegisterResponse>('user/register', formData);
};

// 회원 정보 조회

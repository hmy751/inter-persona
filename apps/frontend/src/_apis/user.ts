import fetcher from './fetcher';
import { RegisterResponseSchema, LoginRequestSchema, LoginResponseSchema } from '@repo/schema/user';
import { z } from 'zod';

// 로그인
type LoginBody = z.infer<typeof LoginRequestSchema>;

type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const fetchLogin = async ({ email, password }: LoginBody) => {
  return fetcher.post<LoginResponse>('user/login', {
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

import fetcher from './fetcher';

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

// 회원 정보 조회

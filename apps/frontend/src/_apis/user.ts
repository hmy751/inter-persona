import fetcher from "./fetcher";

export interface LoginBody {
  email: string;
  password: string;
}
interface LoginResponse {
  name: string;
  email: string;
  imageSrc: string;
}

export const fetchLogin = async ({ email, password }: LoginBody) => {
  return fetcher.post<LoginResponse>("login", {
    email,
    password,
  });
};

import { post } from "./fetcher";

interface UserData {
  id: number;
  name: string;
  imageSrc: string;
}

export interface LoginBody {
  name: string;
  developmentCategory: string;
}

export const fetchLogin = async ({ name, developmentCategory }: LoginBody) => {
  return post<UserData>({
    path: "login",
    body: {
      name,
      developmentCategory,
    },
  });
};

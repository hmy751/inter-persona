import fetcher from "./fetcher";

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
  return fetcher.post<UserData>("login", {
    name,
    developmentCategory,
  });
};

import { post } from "./index";

interface UserData {
  id: number;
  name: string;
  imageSrc: string;
}

export const fetchLogin = async ({
  name,
  developmentCategory,
}: {
  name: string;
  developmentCategory: string;
}) => {
  return post<UserData>({
    path: "login",
    body: {
      name,
      developmentCategory,
    },
  });
};

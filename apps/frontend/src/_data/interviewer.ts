import { useQuery } from "@tanstack/react-query";
import { fetchInterviewerList } from "@/_apis/interviewer";

export const useGetInterviewerList = () => {
  return useQuery({
    queryKey: ["interviewer"],
    queryFn: fetchInterviewerList,
  });
};

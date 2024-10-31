"use client";

import { useState, useMemo } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import InterviewerProfile from "./_components/InterviewerProfile";
import { useQuery } from "@tanstack/react-query";
import { selectChatId } from "@/store/redux/features/chat/selector";
import { useInterviewerStore } from "@/store/useInterviewerStore";

const InterviewerProfileWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Flex
        height={"max-content"}
        paddingY={"40px"}
        borderBottom={"1px solid"}
        borderColor={"gray.100"}
      >
        {children}
      </Flex>
    </>
  );
};

interface Scores {
  standard: string;
  score: number;
  summary: string;
}

export default function Page() {
  const chatId = useSelector(selectChatId) ?? 2;
  const { interviewer } = useInterviewerStore();

  const { data, isLoading } = useQuery<{
    scores: Scores[];
    finalEvaluation: string;
  }>({
    queryKey: ["result", chatId],
    queryFn: () => {
      return fetch(`http://localhost:3030/interview/${chatId}/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    },
  });

  const reviewerName = "엘론 머스크";
  // const { user, isLoggedIn, setUser, clearUser } = useUserStore();

  const totalScore: number = useMemo(() => {
    if (!data?.scores) {
      return 0;
    }

    return data.scores.reduce((acc, { score }) => acc + score, 0);
  }, [data]);

  return (
    <Box
      width={"100%"}
      maxWidth={726}
      flex={1}
      display="flex"
      flexDirection={"column"}
    >
      {isLoading ? (
        <>
          <InterviewerProfileWrapper>
            <InterviewerProfile
              src={interviewer?.imgUrl}
              name={interviewer?.name}
              description={interviewer?.description}
            />
          </InterviewerProfileWrapper>
          <Flex
            direction="column"
            justifyItems="center"
            alignItems="center"
            mt={8}
            gap={10}
            width="100%"
            height="100%"
          >
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "medium",
                color: "#1A202C", // A very dark blue-black color
                textShadow: "1px 2px 2px #1A202C", // Subtle blue shadow for a blue feeling
              }}
            >
              {reviewerName}는 평가 중
            </div>
            <Spinner />
          </Flex>
        </>
      ) : (
        <Flex direction="column" alignItems="center" width="100%" mt={8}>
          <Box
            display="flex"
            alignItems="baseline"
            justifyContent="center"
            width="100%"
            gap={"10px"}
            mb={6}
          >
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "medium",
                color: "#1A202C", // A very dark blue-black color
                textShadow: "1px 2px 2px #1A202C", // Subtle blue shadow for a blue feeling
              }}
            >
              {reviewerName}가 평가한 당신은
            </div>

            <Flex alignItems="baseline">
              <Box
                fontSize={"3rem"}
                fontWeight={"medium"}
                style={{
                  background: "linear-gradient(135deg, #6B46C1, #4299E1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "2px 2px 4px rgba(107, 70, 193, 0.5)",
                }}
              >
                {totalScore}
              </Box>
              <Box fontSize={"2rem"} fontWeight={"medium"} color={"#1A202C"}>
                점
              </Box>
            </Flex>
          </Box>

          <Flex justifyContent="center" flexWrap="wrap" gap={4}>
            {data?.scores?.map(({ standard, score, summary }, index) => (
              <Box
                key={standard}
                width="100%"
                borderWidth={1}
                borderRadius="lg"
                p={4}
                cursor="pointer"
                _hover={{ boxShadow: "0 0 10px 0 rgba(66, 153, 225, 0.5)" }}
                bg="white"
                display="flex"
                alignItems="center"
                transition="all 0.3s"
                boxShadow="0 0 5px 0 rgba(66, 153, 225, 0.3)"
                _active={{
                  transform: "scale(0.98)",
                }}
              >
                <Flex alignItems="center" width="100%">
                  <Box
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    borderRadius="full"
                    width={{ base: "50px", md: "60px" }}
                    height={{ base: "50px", md: "60px" }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    background="linear-gradient(135deg, #6B46C1, #4299E1)"
                    color="white"
                    mr={{ base: 3, md: 4 }}
                    boxShadow="0 4px 6px rgba(107, 70, 193, 0.3)"
                  >
                    {score}
                  </Box>
                  <Box flex={1}>
                    <Box
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.700"
                      mb={1}
                    >
                      {standard}
                    </Box>
                    <Box fontSize="sm" color="gray.500">
                      {summary}
                    </Box>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Flex>

          <Box padding={10}>
            <Box
              fontSize="2xl"
              fontWeight="bold"
              color="purple.600"
              textAlign="center"
              textTransform="uppercase"
              letterSpacing="wide"
              borderBottom="4px solid"
              borderColor="purple.400"
              pb={2}
              mb={4}
            >
              {reviewerName}의 한마디
            </Box>

            <br />

            {data?.finalEvaluation}
          </Box>
        </Flex>
      )}
    </Box>
  );
}

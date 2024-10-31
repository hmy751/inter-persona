"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import InterviewerProfile from "./_components/InterviewerProfile";
import ChatArticle from "./_components/ChatArticle";
import RecordButton from "./_components/RecordButton";
import {
  selectChatContents,
  selectChatLimit,
} from "@/store/redux/features/chat/selector";
import {
  initializeChatState,
  START_CHAT,
} from "@/store/redux/features/chat/slice";
import useUserStore from "@/store/useUserStore";
import { useInterviewerStore } from "@/store/useInterviewerStore";
import { fetchInterview } from "@/apis/interview";

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

const ChatWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Flex
        height={"100%"}
        direction={"column"}
        marginTop={"40px"}
        gap={"20px"}
      >
        {children}
      </Flex>
    </>
  );
};

const RecordButtonWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Flex
        alignItems={"center"}
        height={"80px"}
        direction={"column"}
        marginTop={"40px"}
        gap={"20px"}
        borderTop={"1px solid"}
        borderColor={"gray.100"}
      >
        {children}
      </Flex>
    </>
  );
};

export default function Page() {
  const chatContents = useSelector(selectChatContents);
  const dispatch = useDispatch();
  const chatLimit = useSelector(selectChatLimit);
  const router = useRouter();
  const { interviewer } = useInterviewerStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user || !interviewer) return;

    try {
      (async function init() {
        const data = await fetchInterview({
          interviewerId: interviewer?.id,
          reviewerId: user.id,
        });

        if (!data?.id) return;

        dispatch({
          type: START_CHAT,
          payload: {
            chatId: data?.id,
            content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
          },
        });
      })();
    } catch (err) {}
    return () => {
      dispatch(initializeChatState(null));
    };
  }, [user, interviewer, dispatch]);

  useEffect(() => {
    if (chatLimit) {
      router.push("/result");
    }
  }, [router, chatLimit]);

  if (!user || !interviewer) return null;

  return (
    <Box
      width={"100%"}
      maxWidth={726}
      flex={1}
      display="flex"
      flexDirection={"column"}
    >
      <InterviewerProfileWrapper>
        <InterviewerProfile
          src={interviewer?.imgUrl}
          name={interviewer?.name}
          description={interviewer?.description}
        />
      </InterviewerProfileWrapper>
      <ChatWrapper>
        {chatContents.map(({ speaker, content, status }) => {
          return (
            <ChatArticle key={speaker} type={speaker}>
              {speaker === "bot" ? (
                <>
                  <ChatArticle.Avatar src={interviewer?.imgUrl} />
                  <ChatArticle.Speech status={status} text={content} />
                </>
              ) : (
                <>
                  <ChatArticle.Speech status={status} text={content} />
                  <ChatArticle.Avatar src={user?.imageSrc} />
                </>
              )}
            </ChatArticle>
          );
        })}
      </ChatWrapper>
      <RecordButtonWrapper>
        <RecordButton />
      </RecordButtonWrapper>
    </Box>
  );
}

"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  selectChatContents,
  selectChatLimit,
} from "@/_store/redux/features/chat/selector";
import ChatArticle from "./ChatArticle";
import { useInterviewerStore } from "@/_store/zustand/useInterviewerStore";
import useUserStore from "@/_store/zustand/useUserStore";
import { fetchInterview } from "@/_apis/interview";
import {
  START_CHAT,
  initializeChatState,
} from "@/_store/redux/features/chat/slice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./chat.module.css";
export default function ChatSection({
  interviewerImg,
  userImg,
}: {
  interviewerImg: string;
  userImg: string;
}) {
  const chatContents = useSelector(selectChatContents);
  const dispatch = useDispatch();
  const { interviewer } = useInterviewerStore();
  const { user } = useUserStore();
  const chatLimit = useSelector(selectChatLimit);
  const router = useRouter();

  useEffect(() => {
    if (chatLimit) {
      router.push("/result");
    }
  }, [router, chatLimit]);

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
            interviewId: data?.id,
            content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
          },
        });
      })();
    } catch (err) {}
    return () => {
      dispatch(initializeChatState(null));
    };
  }, [user, interviewer, dispatch]);

  return (
    <div className={styles.chatSectionContainer}>
      {chatContents.map(({ speaker, content, status }, index) => {
        return (
          <ChatArticle
            key={`${speaker}-${index}`}
            type={speaker}
            status={status}
            content={content}
          >
            {speaker === "bot" ? (
              <>
                <ChatArticle.Avatar src={interviewerImg} />
                <ChatArticle.Speech />
              </>
            ) : (
              <>
                <ChatArticle.Speech />
                <ChatArticle.Avatar src={userImg} />
                <ChatArticle.RetryCancelSelector />
              </>
            )}
          </ChatArticle>
        );
      })}
    </div>
  );
}

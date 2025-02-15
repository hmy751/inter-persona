"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  selectChatContents,
  selectChatLimit,
} from "@/_store/redux/features/chat/selector";
import ChatArticle from "./ChatArticle";
import {
  START_CHAT,
  initializeChatState,
} from "@/_store/redux/features/chat/slice";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./chat.module.css";
import { AI_NETWORK_ERROR_TOAST } from "@/_store/redux/features/chat/constants";
import useToastStore from "@repo/store/useToastStore";

import {
  useGetInterviewInterviewer,
  useGetInterviewUser,
} from "@/_data/interview";

export default function ChatSection() {
  const interviewId = useParams().interviewId;
  const dispatch = useDispatch();
  const chatContents = useSelector(selectChatContents);
  const addToast = useToastStore((state) => state.addToast);

  const { data: interviewerData } = useGetInterviewInterviewer(
    Number(interviewId)
  );
  const { data: userData } = useGetInterviewUser(Number(interviewId));

  useEffect(() => {
    try {
      (async function init() {
        dispatch({
          type: START_CHAT,
          payload: {
            interviewId: interviewId,
            content: "안녕하세요. 간단히 자기소개 부탁드립니다.",
          },
        });
      })();
    } catch (err) {
      addToast(AI_NETWORK_ERROR_TOAST);
    }

    return () => {
      dispatch(initializeChatState(null));
    };
  }, [interviewId]);

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
                <ChatArticle.Avatar
                  src={interviewerData?.interviewer.imgUrl ?? ""}
                />
                <ChatArticle.Speech />
              </>
            ) : (
              <>
                <ChatArticle.Speech />
                <ChatArticle.Avatar src={userData?.user.imgUrl ?? ""} />
                <ChatArticle.RetryCancelSelector />
              </>
            )}
          </ChatArticle>
        );
      })}
    </div>
  );
}

import { createContext, useContext, useMemo } from "react";
import styles from "./chat.module.css";
import Avatar from "@repo/ui/Avatar";
import clsx from "clsx";
import Button from "@repo/ui/Button";
import { ChatContentStatusType } from "@/store/redux/type";

export type ChatType = "user" | "bot" | "";

interface ChatArticleProps {
  type: ChatType;
  status: ChatContentStatusType;
  children: React.ReactNode;
}

interface ChatSpeechProps {
  text: string | null;
}

const ChatArticleContext = createContext<{
  type: ChatType;
  status: ChatContentStatusType;
}>({ type: "", status: ChatContentStatusType.loading });

function ChatRetryCancelSelector() {
  const { status } = useContext(ChatArticleContext);

  if (status !== ChatContentStatusType.fail) return null;

  return (
    <div className={styles.retryCancelSelector}>
      <Button size="sm" variant="secondary">
        다시 시도하기
      </Button>
      <Button size="sm" variant="outline">
        취소하기
      </Button>
    </div>
  );
}

function ChatSpeech({ text }: ChatSpeechProps) {
  const { type, status } = useContext(ChatArticleContext);

  if (status === "loading") {
    if (type === "user") {
      return (
        <div
          className={clsx(styles.skeletonLoader, styles.skeletonBlueBackground)}
        />
      );
    } else {
      return (
        <div
          className={clsx(styles.skeletonLoader, styles.skeletonGrayBackground)}
        />
      );
    }
  }

  return (
    <div
      className={type === "user" ? styles.chatSpeechUser : styles.chatSpeechBot}
    >
      {text}
    </div>
  );
}

function ChatAvatar({ src }: { src: string }) {
  return (
    <div className={styles.avatarContainer}>
      <Avatar src={src} />
    </div>
  );
}

export default function ChatArticle({
  type,
  children,
  status,
}: ChatArticleProps) {
  const contextValue = useMemo(() => ({ type, status }), [type, status]);

  return (
    <ChatArticleContext.Provider value={contextValue}>
      <div
        className={
          type === "user" ? styles.chatArticleUser : styles.chatArticleBot
        }
      >
        {children}
      </div>
    </ChatArticleContext.Provider>
  );
}

ChatArticle.Avatar = ChatAvatar;
ChatArticle.Speech = ChatSpeech;
ChatArticle.RetryCancelSelector = ChatRetryCancelSelector;

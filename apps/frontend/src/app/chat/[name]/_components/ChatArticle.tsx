import { createContext, useContext, useMemo } from "react";
import styles from "./chat.module.css";
import Avatar from "@repo/ui/Avatar";
import clsx from "clsx";

export type ChatType = "user" | "bot" | "";

interface ChatArticleProps {
  type: ChatType;
  children: React.ReactNode;
}

interface ChatSpeechProps {
  status: string;
  text: string | null;
}

const ChatArticleContext = createContext<{ type: ChatType }>({ type: "" });

function ChatAvatar({ src }: { src: string }) {
  return (
    <div className={styles.avatarContainer}>
      <Avatar src={src} />
    </div>
  );
}

function ChatSpeech({ status, text }: ChatSpeechProps) {
  const { type } = useContext(ChatArticleContext);

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

function ChatArticle({ type, children }: ChatArticleProps) {
  const contextValue = useMemo(() => ({ type }), [type]);

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

export default ChatArticle;

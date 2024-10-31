import { createContext, useMemo, useContext } from "react";
import Avatar from "@repo/ui/Avatar";
import { Box, Flex, Skeleton } from "@chakra-ui/react";

export type ChatType = "user" | "bot" | "";

interface ChatArticleProps extends React.PropsWithChildren {
  type: ChatType;
}

interface ChatSpeechProps {
  status: string; // loading, error, success
  text: string | null;
}

const ChatArticleContext = createContext<{ type: ChatType }>({
  type: "",
});

function ChatAvatar({ src }: { src: string }) {
  return (
    <Flex justifyContent={"flex-start"} height={"100%"}>
      <Avatar src={src} />
    </Flex>
  );
}

function ChatSpeech({ status, text }: ChatSpeechProps) {
  const { type } = useContext(ChatArticleContext);
  const color = type === "bot" ? "mainGray" : "mainBlue";
  return (
    <>
      {status === "loading" ? (
        <Skeleton
          width={"200px"}
          height={"44px"}
          borderRadius={"10px"}
          color={color}
          padding={"10px"}
        />
      ) : (
        <Box borderRadius={"10px"} backgroundColor={color} padding={"10px"}>
          {text}
        </Box>
      )}
    </>
  );
}

function ChatArticle({ type, children }: ChatArticleProps) {
  const ContextValue = useMemo(() => {
    return { type };
  }, [type]);

  return (
    <ChatArticleContext.Provider value={ContextValue}>
      <Flex
        alignItems={"center"}
        gap="10px"
        justifyContent={type !== "user" ? "flex-start" : "flex-end"}
      >
        {children}
      </Flex>
    </ChatArticleContext.Provider>
  );
}

ChatArticle.Avatar = ChatAvatar;
ChatArticle.Speech = ChatSpeech;

export default ChatArticle;

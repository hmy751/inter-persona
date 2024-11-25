import { RootState } from "@/store/redux/rootStore";

const CHAT_LIMIT = 21;

export const selectChatContents = (state: RootState) => state.chat.contents;
export const selectLastBotChatStatus = (state: RootState) => {
  const lastChat = state.chat.contents[state.chat.contents.length - 1];

  if (lastChat?.speaker === "bot") {
    return lastChat.status;
  }

  return null;
};
export const selectCurrentRecordingAnswer = (state: RootState) => {
  const lastChat = state.chat.contents[state.chat.contents.length - 1];

  if (lastChat?.speaker === "user") {
    return lastChat;
  }

  return null;
};
export const selectChatId = (state: RootState) => {
  return state.chat.id;
};
export const selectChatLimit = (state: RootState) => {
  return state.chat.contents.length >= CHAT_LIMIT;
};

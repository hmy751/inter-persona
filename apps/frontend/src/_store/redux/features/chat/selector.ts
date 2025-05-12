import { RootState } from '@/_store/redux/rootStore';
import { ChatContentSpeakerType } from '@/_store/redux/type';

const CHAT_LIMIT = 21;

export const selectChatContents = (state: RootState) => state.chat.contents;
export const selectLastBotChatStatus = (state: RootState) => {
  const lastChat = state.chat.contents[state.chat.contents.length - 1];

  if (lastChat?.speaker === ChatContentSpeakerType.interviewer) {
    return lastChat.status;
  }

  return null;
};
export const selectCurrentRecordingAnswer = (state: RootState) => {
  const lastChat = state.chat.contents[state.chat.contents.length - 1];

  if (lastChat?.speaker === ChatContentSpeakerType.user) {
    return lastChat;
  }

  return null;
};
export const selectInterviewId = (state: RootState) => {
  return state.chat.interviewId;
};
export const selectChatLimit = (state: RootState) => {
  return state.chat.contents.length >= CHAT_LIMIT;
};

export const selectInterviewStatus = (state: RootState) => {
  return state.chat.interviewStatus;
};

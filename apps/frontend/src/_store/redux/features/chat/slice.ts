import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ChatContentStatusType, ChatContentSpeakerType } from '@/_store/redux/type';

export interface ChatContent {
  status: ChatContentStatusType;
  speaker: ChatContentSpeakerType;
  content: string;
  timeStamp: Date;
}

export interface ChatState {
  interviewId: number | null;
  interviewStatus: 'completed' | 'ongoing';
  contents: ChatContent[];
  trySpeechCount: number;
}

const initialState: ChatState = {
  interviewId: null,
  interviewStatus: 'ongoing',
  contents: [],
  trySpeechCount: 0,
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    initializeChatState: (
      state,
      action: PayloadAction<{
        contents: ChatContent[];
        interviewId: number;
        interviewStatus: 'completed' | 'ongoing';
      } | null>
    ) => {
      if (action.payload?.contents?.length) {
        state.contents = [...action.payload.contents];
        state.interviewId = action.payload.interviewId;
        state.interviewStatus = action.payload.interviewStatus;
      } else {
        state.contents = [];
        state.interviewId = null;
        state.interviewStatus = 'ongoing';
      }
    },
    startChat: (state, action: PayloadAction<{ interviewId: number }>) => {
      state.interviewId = action.payload.interviewId;
    },
    triggerContent: (state, action: PayloadAction<{ speaker: ChatContentSpeakerType }>) => {
      const current = {
        status: ChatContentStatusType.loading,
        speaker: action.payload.speaker,
        content: '',
        timeStamp: new Date(),
      };
      state.contents.push(current);
    },
    updateContent: (state, action: PayloadAction<{ content: string }>) => {
      if (state?.contents?.length > 0) {
        const lastContent = state.contents[state.contents.length - 1] as ChatContent;
        lastContent.content = action.payload.content;
        lastContent.status = ChatContentStatusType.success;
      }
    },
    errorContent: state => {
      if (state?.contents?.length > 0) {
        const lastContent = state.contents[state.contents.length - 1] as ChatContent;
        lastContent.status = ChatContentStatusType.fail;
      }
    },
    resetContentStatus: state => {
      if (state?.contents?.length > 0) {
        const lastContent = state.contents[state.contents.length - 1] as ChatContent;
        lastContent.status = ChatContentStatusType.idle;
      }
    },
    removeContent: state => {
      state.contents.pop();
    },
    increaseTrySpeechCount: state => {
      state.trySpeechCount++;
    },
    resetTrySpeechCount: state => {
      state.trySpeechCount = 0;
    },
  },
});

export const {
  initializeChatState,
  triggerContent,
  updateContent,
  removeContent,
  errorContent,
  startChat,
  increaseTrySpeechCount,
  resetTrySpeechCount,
  resetContentStatus,
} = slice.actions;

export const SEND_RECORD = 'SEND_RECORD' as const;
export const START_CHAT = 'START_CHAT' as const;
export const REQUEST_ANSWER = 'REQUEST_ANSWER' as const;
export const RETRY_ANSWER = 'RETRY_ANSWER' as const;
export const CANCEL_CURRENT_REQUEST_ANSWER = 'CANCEL_CURRENT_REQUEST_ANSWER' as const;

export default slice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  ChatContentStatusType,
  ChatContentSpeakerType,
} from "@/store/redux/type";

export interface ChatContent {
  status: ChatContentStatusType;
  speaker: ChatContentSpeakerType;
  content: string;
  timeStamp: Date;
}

export interface ChatState {
  id: number | null;
  contents: ChatContent[];
}

const initialState: ChatState = {
  id: null,
  contents: [],
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    initializeChatState: (
      state,
      action: PayloadAction<ChatContent[] | null>
    ) => {
      if (action.payload?.length) {
        state.contents = [...action.payload];
      } else {
        state.contents = [];
      }

      state.id = null;
    },
    startChat: (state, action: PayloadAction<{ id: number }>) => {
      state.id = action.payload.id;
    },
    triggerContent: (
      state,
      action: PayloadAction<{ speaker: ChatContentSpeakerType }>
    ) => {
      const current = {
        status: ChatContentStatusType.loading,
        speaker: action.payload.speaker,
        content: "",
        timeStamp: new Date(),
      };
      state.contents.push(current);
    },
    updateContent: (state, action: PayloadAction<{ content: string }>) => {
      if (state?.contents?.length > 0) {
        const lastContent = state.contents[
          state.contents.length - 1
        ] as ChatContent;
        lastContent.content = action.payload.content;
        lastContent.status = ChatContentStatusType.success;
      }
    },
    errorContent: (state) => {
      if (state?.contents?.length > 0) {
        const lastContent = state.contents[
          state.contents.length - 1
        ] as ChatContent;
        lastContent.status = ChatContentStatusType.fail;
      }
    },
    removeContent: (state) => {
      state.contents.pop();
    },
  },
});

export const {
  initializeChatState,
  triggerContent,
  updateContent,
  removeContent,
  startChat,
} = slice.actions;

export const SEND_RECORD = "SEND_RECORD" as const;
export const START_CHAT = "START_CHAT" as const;
export const REQUEST_INTERVIEW = "REQUEST_INTERVIEW" as const;

export default slice.reducer;

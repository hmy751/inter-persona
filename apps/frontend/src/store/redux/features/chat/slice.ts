import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StatusType } from "@/store/redux/type";

export interface ChatContent {
  status: StatusType;
  speaker: "user" | "bot";
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
      action: PayloadAction<{ speaker: "user" | "bot" }>
    ) => {
      const current = {
        status: "loading" as const,
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
        lastContent.status = "success";
      }
    },
    errorContent: (state) => {
      if (state?.contents?.length > 0) {
        const lastContent = state.contents[
          state.contents.length - 1
        ] as ChatContent;
        lastContent.status = "fail";
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

export default slice.reducer;

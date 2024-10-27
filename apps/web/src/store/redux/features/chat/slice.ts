import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StatusType } from "@/store/redux/type";

interface ChatContent {
  status: StatusType;
  speaker: "user" | "bot";
  content: string;
  timeStamp: Date;
}

interface ChatState {
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
    triggerChat: (
      state,
      action: PayloadAction<{ speaker: "user" | "bot" }>
    ) => {
      const current = {
        status: "loading" as "loading",
        speaker: action.payload.speaker,
        content: "",
        timeStamp: new Date(),
      };
      state.contents.push(current);
    },
    updateContent: (state, action: PayloadAction<{ content: string }>) => {
      state.contents[state.contents.length - 1].content =
        action.payload.content;
      state.contents[state.contents.length - 1].status = "success";
    },
    removeContent: (state) => {
      state.contents.pop();
    },
  },
});

export const {
  initializeChatState,
  triggerChat,
  updateContent,
  removeContent,
  startChat,
} = slice.actions;

export const SEND_RECORD = "SEND_RECORD" as const;
export const START_CHAT = "START_CHAT" as const;

export default slice.reducer;

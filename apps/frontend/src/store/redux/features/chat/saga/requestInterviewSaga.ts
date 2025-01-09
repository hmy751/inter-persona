
import {
  call,
  put,
  select,
} from "redux-saga/effects";
import {
  START_CHAT,
  triggerContent,
  updateContent,
  removeContent,
  startChat,
  failAIResponse,
} from "../slice";
import { delay } from "../../../utils";
import { RootState } from "@/store/redux/rootStore";
import {
  fetchAIChat,
  AIChatData,
} from "@/apis/interview";
import { ChatContentSpeakerType } from "@/store/redux/type";
import { useToastStore } from "@repo/store/useToastStore";
import { AI_ERROR_TOAST, AI_NETWORK_ERROR_TOAST } from "../constants";
import { errorContent } from "../slice";
interface RequestInterviewAction {
  type: string;
  payload: {
    chatId: number;
    content: string;
  };
}
const selectChatState = (state: RootState) => state.chat.id;

export function* requestInterviewSaga(action: RequestInterviewAction): Generator<any, void, any> {
  try {
    yield call(delay, 200);

    if (action.type === START_CHAT) {
      yield put(startChat({ id: action.payload.chatId }));
    }
    const chatId: number = yield select(selectChatState);

    yield put(triggerContent({ speaker: ChatContentSpeakerType.bot }));
    yield call(delay, 500);

    const data: AIChatData = yield call(fetchAIChat, {
      chatId,
      content: action.payload.content,
    });

    if (data.content) {
      yield put(updateContent({ content: data.content as unknown as string }));
    } else {
      yield put(removeContent());
      yield put(errorContent());
    }
  } catch (err) {
    useToastStore
      .getState()
      .addToast(AI_NETWORK_ERROR_TOAST);
    yield put(removeContent());
  }
}
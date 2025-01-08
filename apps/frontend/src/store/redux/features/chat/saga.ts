import {
  takeLatest,
  call,
  put,
  select,
} from "redux-saga/effects";
import {
  SEND_RECORD,
  START_CHAT,
  REQUEST_INTERVIEW,
  triggerContent,
  updateContent,
  removeContent,
  startChat,
  resetTrySpeechCount,
  increaseTrySpeechCount,
} from "./slice";
import { delay } from "../../utils";
import { RootState } from "@/store/redux/rootStore";
import {
  fetchAIChat,
  fetchSpeechToText,
  AIChatData,
  SpeechToTextData,
} from "@/apis/interview";
import { ChatContentSpeakerType } from "@/store/redux/type";
import { useToastStore } from "@repo/store/useToastStore";
import { STT_ERROR_TOAST, STT_NETWORK_ERROR_TOAST, AI_ERROR_TOAST, AI_NETWORK_ERROR_TOAST } from "./constants";
interface SendRecordAction {
  type: string;
  payload: {
    id: bigint;
    formData: FormData;
  };
}

interface RequestInterviewAction {
  type: string;
  payload: {
    chatId: number;
    content: string;
  };
}
const selectChatState = (state: RootState) => state.chat.id;
const selectTrySpeechCount = (state: RootState) => state.chat.trySpeechCount;

export function* watchRecord() {
  yield takeLatest(SEND_RECORD, speechToTextSaga);
}

export function* speechToTextSaga(action: SendRecordAction): Generator<any, void, any> {
  try {
    yield call(delay, 200);

    yield put(triggerContent({ speaker: ChatContentSpeakerType.user }));
    yield call(delay, 500);

    const data: SpeechToTextData = yield call(fetchSpeechToText, {
      formData: action.payload.formData,
    });
    const chatId: number = yield select(selectChatState);
    const trySpeechCount: number = yield select(selectTrySpeechCount);

    if (data?.text) {
      yield put(updateContent({ content: data.text }));
      yield* requestInterviewSaga({
        type: REQUEST_INTERVIEW,
        payload: { content: data.text as unknown as string, chatId },
      });
      yield put(resetTrySpeechCount());
      return;
    }

    if (data.text === '' && trySpeechCount < 3) {
      useToastStore
        .getState()
        .addToast(STT_ERROR_TOAST);
      yield put(removeContent());
      yield put(increaseTrySpeechCount());
      return;
    }

    throw new Error('녹음 변환 에러');
  } catch (err) {
    useToastStore
      .getState()
      .addToast(STT_NETWORK_ERROR_TOAST);
    yield put(removeContent());
  }
}

export function* watchStartChat() {
  yield takeLatest(START_CHAT, requestInterviewSaga);
}

export function* requestInterviewSaga(action: RequestInterviewAction) {
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
      useToastStore
        .getState()
        .addToast(AI_ERROR_TOAST);
      yield put(removeContent());
    }
  } catch (err) {
    useToastStore
      .getState()
      .addToast(AI_NETWORK_ERROR_TOAST);
    yield put(removeContent());
  }
}

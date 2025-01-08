import {
  takeLatest,
  call,
  put,
  takeEvery,
  select,
  debounce,
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
        .addToast({
          title: 'STT API 에러',
          description: "음성이 제대로 입력되지 않았습니다. 답변을 다시 입력해주세요!",
          duration: 3000
        });
      yield put(removeContent());
      yield put(increaseTrySpeechCount());
      return;
    }

    throw new Error('STT API 에러');
  } catch (err) {
    useToastStore
      .getState()
      .addToast({
        title: 'STT API 에러',
        description: "요청에 실패했습니다. 인터뷰를 다시 시도해주세요!",
        duration: 3000
      });
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
        .addToast({
          title: 'AI 응답 에러',
          description: "다시 시도해주세요!",
          duration: 3000
        });
      yield put(removeContent());
    }
  } catch (err) {
    useToastStore
      .getState()
      .addToast({
        title: 'AI 응답 에러',
        description: "요청에 실패했습니다. 인터뷰를 다시 시도해주세요!",
        duration: 3000
      });
    yield put(removeContent());
  }
}

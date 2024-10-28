import { takeLatest, call, put, takeEvery, select } from "redux-saga/effects";
import {
  SEND_RECORD,
  triggerChat,
  updateContent,
  removeContent,
  START_CHAT,
  startChat,
} from "./slice";
import { delay } from "../../utils";
import { RootState } from "@/store/redux/rootStore";
import {
  fetchAIChat,
  fetchSpeechToText,
  AIChatData,
  SpeechToTextData,
} from "@/apis/interview";

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

function* requestInterviewSaga(action: RequestInterviewAction) {
  try {
    if (action.type === START_CHAT) {
      yield put(startChat({ id: action.payload.chatId }));
    }
    const chatId: number = yield select(selectChatState);

    yield put(triggerChat({ speaker: "bot" }));
    yield call(delay, 500);

    const data: AIChatData = yield call(fetchAIChat, {
      chatId,
      content: action.payload.content,
    });

    if (data.content) {
      yield put(updateContent({ content: data.content as unknown as string }));
    } else {
      yield put(removeContent());
    }
  } catch (err) {
    yield put(removeContent());
  }
}

function* speechToTextSaga(
  action: SendRecordAction
): Generator<any, void, Response> {
  try {
    yield put(triggerChat({ speaker: "user" }));
    yield call(delay, 500);

    const data: SpeechToTextData = yield call(fetchSpeechToText, {
      formData: action.payload.formData,
    });

    if (data.text) {
      yield put(updateContent({ content: data.text }));
      yield* requestInterviewSaga({
        type: "REQUEST_INTERVIEW",
        payload: { content: data.text as unknown as string },
      });
    } else {
      yield put(removeContent());
    }
  } catch (err) {
    yield put(removeContent());
  }
}

export function* watchRecord() {
  yield takeLatest(SEND_RECORD, speechToTextSaga);
}

export function* watchStartChat() {
  yield takeLatest(START_CHAT, requestInterviewSaga);
}

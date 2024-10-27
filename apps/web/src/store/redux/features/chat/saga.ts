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
const selectChatState = (state) => state.chat.id;

function* requestInterviewSaga(action: RequestInterviewAction) {
  try {
    if (action.type === START_CHAT) {
      yield put(startChat({ id: action.payload.chatId }));
    }
    const chatId = yield select(selectChatState);

    yield put(triggerChat({ speaker: "bot" }));
    yield call(delay, 500);
    const response: Response = yield call(
      fetch,
      `http://localhost:3030/interview/${chatId}/contents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: action.payload.content,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("STT API request failed");
    }

    const data = yield response.json();

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

    const response: Response = yield call(fetch, "/api/chat", {
      method: "POST",
      body: action.payload.formData,
    });

    if (!response.ok) {
      throw new Error("STT API request failed");
    }

    const data = yield response.json();

    if (data.text) {
      yield put(updateContent({ content: data.text as unknown as string }));
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

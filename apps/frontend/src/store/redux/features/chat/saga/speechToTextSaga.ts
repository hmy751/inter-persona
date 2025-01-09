
import {
  call,
  put,
  select,
} from "redux-saga/effects";
import {
  REQUEST_INTERVIEW,
  triggerContent,
  updateContent,
  removeContent,
  resetTrySpeechCount,
  increaseTrySpeechCount,
} from "../slice";
import { delay } from "../../../utils";
import { RootState } from "@/store/redux/rootStore";
import {
  fetchSpeechToText,
  SpeechToTextData,
} from "@/apis/interview";
import { ChatContentSpeakerType } from "@/store/redux/type";
import { useToastStore } from "@repo/store/useToastStore";
import { STT_ERROR_TOAST, STT_NETWORK_ERROR_TOAST } from "../constants";

const selectChatState = (state: RootState) => state.chat.id;
const selectTrySpeechCount = (state: RootState) => state.chat.trySpeechCount;

import { requestInterviewSaga } from "./requestInterviewSaga";

interface SendRecordAction {
  type: string;
  payload: {
    id: bigint;
    formData: FormData;
  };
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
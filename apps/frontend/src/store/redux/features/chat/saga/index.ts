import { takeLatest } from "redux-saga/effects";
import { SEND_RECORD, START_CHAT, REQUEST_INTERVIEW } from "../slice";

import { requestInterviewSaga } from "./requestInterviewSaga";
import { speechToTextSaga } from "./speechToTextSaga";

export function* watchRecord() {
  yield takeLatest(SEND_RECORD, speechToTextSaga);
}

export function* watchStartChat() {
  yield takeLatest(START_CHAT, requestInterviewSaga);
}

export function* watchRetry() {
  yield takeLatest(REQUEST_INTERVIEW, requestInterviewSaga);
}
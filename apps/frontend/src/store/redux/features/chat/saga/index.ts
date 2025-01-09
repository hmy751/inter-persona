import { takeLatest } from "redux-saga/effects";
import { SEND_RECORD, START_CHAT, REQUEST_INTERVIEW, CANCEL_CURRENT_REQUEST_INTERVIEW } from "../slice";

import { requestInterviewSaga, cancelCurrentRequestInterviewSaga } from "./requestInterviewSaga";
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

export function* watchCancelCurrentRequestInterview() {
  yield takeLatest(CANCEL_CURRENT_REQUEST_INTERVIEW, cancelCurrentRequestInterviewSaga);
}
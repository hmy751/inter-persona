import { takeLatest } from "redux-saga/effects";
import { SEND_RECORD, START_CHAT, REQUEST_INTERVIEW, CANCEL_CURRENT_REQUEST_INTERVIEW, RETRY_INTERVIEW } from "../slice";

import { requestInterviewSaga, cancelCurrentRequestInterviewSaga, retryInterviewSaga } from "./requestInterviewSaga";
import { speechToTextSaga } from "./speechToTextSaga";

export function* watchRecord() {
  yield takeLatest(SEND_RECORD, speechToTextSaga);
}

export function* watchStartChat() {
  yield takeLatest(START_CHAT, requestInterviewSaga);
}

export function* watchRetry() {
  yield takeLatest(RETRY_INTERVIEW, retryInterviewSaga);
}

export function* watchCancelCurrentRequestInterview() {
  yield takeLatest(CANCEL_CURRENT_REQUEST_INTERVIEW, cancelCurrentRequestInterviewSaga);
}
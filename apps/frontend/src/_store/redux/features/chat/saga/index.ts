import { takeLatest } from 'redux-saga/effects';
import { SEND_RECORD, START_CHAT, CANCEL_CURRENT_REQUEST_ANSWER, RETRY_ANSWER } from '../slice';

import { requestAnswerSaga, cancelCurrentRequestAnswerSaga, retryAnswerSaga } from './requestAnswerSaga';
import { speechToTextSaga } from './speechToTextSaga';

export function* watchRecord() {
  yield takeLatest(SEND_RECORD, speechToTextSaga);
}

export function* watchStartChat() {
  yield takeLatest(START_CHAT, requestAnswerSaga);
}

export function* watchRetryAnswer() {
  yield takeLatest(RETRY_ANSWER, retryAnswerSaga);
}

export function* watchCancelCurrentRequestAnswer() {
  yield takeLatest(CANCEL_CURRENT_REQUEST_ANSWER, cancelCurrentRequestAnswerSaga);
}

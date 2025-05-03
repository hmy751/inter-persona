import { all } from 'redux-saga/effects';
import {
  watchRecord,
  watchStartChat,
  watchRetryAnswer,
  watchCancelCurrentRequestAnswer,
} from '@/_store/redux/features/chat/saga';

export function* helloSaga() {}

export function* rootSaga() {
  yield all([helloSaga(), watchRecord(), watchStartChat(), watchRetryAnswer(), watchCancelCurrentRequestAnswer()]);
}

import { all } from "redux-saga/effects";
import { watchRecord, watchStartChat, watchRetry, watchCancelCurrentRequestInterview } from "@/store/redux/features/chat/saga";

export function* helloSaga() {
  console.log("Hello Sagas!");
}

export function* rootSaga() {
  yield all([helloSaga(), watchRecord(), watchStartChat(), watchRetry(), watchCancelCurrentRequestInterview()]);
}

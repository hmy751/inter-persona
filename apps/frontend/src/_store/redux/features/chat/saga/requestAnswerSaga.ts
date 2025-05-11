import { call, put, select } from 'redux-saga/effects';
import {
  START_CHAT,
  triggerContent,
  updateContent,
  removeContent,
  startChat,
  resetTrySpeechCount,
  CANCEL_CURRENT_REQUEST_ANSWER,
  resetContentStatus,
  errorContent,
} from '../slice';
import { delay } from '../../../utils';
import { RootState } from '@/_store/redux/rootStore';
import { fetchAnswer, AnswerData, fetchStartInterview } from '@/_apis/interview';
import { ChatContentSpeakerType } from '@/_store/redux/type';
import { useToastStore } from '@repo/store/useToastStore';
import { AI_ERROR_TOAST, AI_NETWORK_ERROR_TOAST } from '../constants';
interface RequestAnswerAction {
  type: string;
  payload: {
    interviewId: number;
    content: string;
  };
}
const selectInterviewId = (state: RootState) => state.chat.interviewId;

export function* retryAnswerSaga(action: RequestAnswerAction): Generator<any, void, any> {
  yield put(resetContentStatus());
  yield* requestAnswerSaga(action);
}

export function* requestAnswerSaga(action: RequestAnswerAction): Generator<any, void, any> {
  try {
    if (action.type === START_CHAT) {
      yield put(startChat({ interviewId: action.payload.interviewId }));
    }
    const interviewId: number = yield select(selectInterviewId);

    yield call(delay, 200);

    yield put(triggerContent({ speaker: ChatContentSpeakerType.interviewer }));
    yield call(delay, 500);

    let data: AnswerData;

    if (action.type === START_CHAT) {
      data = yield call(fetchStartInterview, {
        interviewId,
      });
    } else {
      data = yield call(fetchAnswer, {
        interviewId,
        content: action.payload.content,
      });
    }

    if (data.content) {
      yield put(updateContent({ content: data.content as unknown as string }));
    } else {
      yield put(removeContent());
      yield put(errorContent());
    }
  } catch (err) {
    useToastStore.getState().addToast(AI_NETWORK_ERROR_TOAST);
    yield put(removeContent());
  }
}

export function* cancelCurrentRequestAnswerSaga(): Generator<any, void, any> {
  yield put(removeContent());
  yield put(resetTrySpeechCount());
}

import { call, put, select, CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import {
  START_CHAT,
  triggerContent,
  updateContent,
  removeContent,
  startChat,
  resetTrySpeechCount,
  resetContentStatus,
  setInterviewStatus,
  errorContent,
} from '../slice';
import { delay } from '@/_libs/utils';
import { RootState } from '@/_store/redux/rootStore';
import { fetchAnswer, AnswerData, fetchStartInterview, fetchGetInterviewStatus } from '@/_apis/interview';
import { ChatContentSpeakerType } from '@/_store/redux/type';
import { useToastStore } from '@repo/store/useToastStore';
import { AI_NETWORK_ERROR_TOAST } from '../constants';
import { GTMInterviewCompleted } from '@/_libs/utils/analysis/interview';
import { getSessionId } from '@/_libs/utils/session';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';
interface RequestAnswerAction {
  type: string;
  payload: {
    interviewId: number;
    content: string;
  };
}
const selectInterviewId = (state: RootState) => state.chat.interviewId;

export function* retryAnswerSaga(action: RequestAnswerAction): Generator<unknown, void, unknown> {
  yield put(resetContentStatus());
  yield* requestAnswerSaga(action);
}

export function* requestAnswerSaga(
  action: RequestAnswerAction
): Generator<CallEffect | PutEffect | SelectEffect, void, unknown> {
  try {
    if (action.type === START_CHAT) {
      yield put(startChat({ interviewId: action.payload.interviewId }));
    }

    const interviewId = (yield select(selectInterviewId)) as number;

    yield call(delay, 200);

    yield put(triggerContent({ speaker: ChatContentSpeakerType.interviewer }));
    yield call(delay, 500);

    let data: AnswerData;

    if (action.type === START_CHAT) {
      data = (yield call(fetchStartInterview, {
        interviewId,
      })) as AnswerData;
    } else {
      data = (yield call(fetchAnswer, {
        interviewId,
        content: action.payload.content,
      })) as AnswerData;
    }

    if (data.content) {
      yield put(updateContent({ content: data.content as unknown as string }));
    } else {
      yield put(removeContent());
      yield put(errorContent());
    }

    const statusData = (yield call(fetchGetInterviewStatus, {
      interviewId,
    })) as { status: string };

    if (statusData.status === 'completed') {
      yield put(setInterviewStatus('completed'));

      GTMInterviewCompleted({
        interview_id: interviewId.toString(),
        session_id: getSessionId() || '',
        funnel_id: useFunnelIdStore.getState().funnelId || '',
      });
    }
  } catch (err) {
    useToastStore.getState().addToast(AI_NETWORK_ERROR_TOAST);
    yield put(removeContent());
  }
}

export function* cancelCurrentRequestAnswerSaga(): Generator<unknown, void, unknown> {
  yield put(removeContent());
  yield put(resetTrySpeechCount());
}

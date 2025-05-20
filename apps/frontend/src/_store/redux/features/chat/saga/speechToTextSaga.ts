import { call, put, select, CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import {
  REQUEST_ANSWER,
  triggerContent,
  updateContent,
  removeContent,
  resetTrySpeechCount,
  increaseTrySpeechCount,
} from '../slice';
import { delay } from '@/_libs/utils';
import { RootState } from '@/_store/redux/rootStore';
import { fetchSpeechToText, SpeechToTextData } from '@/_apis/interview';
import { ChatContentSpeakerType } from '@/_store/redux/type';
import { useToastStore } from '@repo/store/useToastStore';
import { STT_ERROR_TOAST, STT_NETWORK_ERROR_TOAST } from '../constants';

const selectInterviewId = (state: RootState) => state.chat.interviewId;
const selectTrySpeechCount = (state: RootState) => state.chat.trySpeechCount;

import { requestAnswerSaga } from './requestAnswerSaga';
import { GTMSTTResultSuccess, GTMSTTResultFailed } from '@/_libs/utils/analysis/interview';
import { getSessionId } from '@/_libs/utils/session';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';

interface SendRecordAction {
  type: string;
  payload: {
    id: bigint;
    formData: FormData;
  };
}

export function* speechToTextSaga(
  action: SendRecordAction
): Generator<CallEffect | PutEffect | SelectEffect, void, unknown> {
  try {
    yield call(delay, 200);

    yield put(triggerContent({ speaker: ChatContentSpeakerType.user }));
    yield call(delay, 500);

    const data = (yield call(fetchSpeechToText, {
      formData: action.payload.formData,
    })) as SpeechToTextData;
    const interviewId = (yield select(selectInterviewId)) as number;
    const trySpeechCount = (yield select(selectTrySpeechCount)) as number;

    if (data?.text) {
      yield put(updateContent({ content: data.text }));
      yield* requestAnswerSaga({
        type: REQUEST_ANSWER,
        payload: { content: data.text as unknown as string, interviewId },
      });
      yield put(resetTrySpeechCount());

      GTMSTTResultSuccess({
        interview_id: interviewId.toString(),
        session_id: getSessionId() || '',
        funnel_id: useFunnelIdStore.getState().funnelId || '',
      });

      return;
    }

    if (data.text === '' && trySpeechCount < 3) {
      useToastStore.getState().addToast(STT_ERROR_TOAST);
      yield put(removeContent());
      yield put(increaseTrySpeechCount());
      return;
    }

    GTMSTTResultFailed({
      interview_id: interviewId.toString(),
      session_id: getSessionId() || '',
      funnel_id: useFunnelIdStore.getState().funnelId || '',
      error_message: '녹음 변환 에러',
    });

    throw new Error('녹음 변환 에러');
  } catch (err) {
    useToastStore.getState().addToast(STT_NETWORK_ERROR_TOAST);
    yield put(removeContent());
  }
}

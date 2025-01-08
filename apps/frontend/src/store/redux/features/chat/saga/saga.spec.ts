import { http } from 'msw';
import { baseURL } from '@/apis/fetcher';
import { server } from '@/mocks/server';
import { runSaga } from 'redux-saga';
import useToastStore from '@repo/store/useToastStore';

import { speechToTextSaga } from './speechToTextSaga';
import { requestInterviewSaga } from './requestInterviewSaga';
import { removeContent, triggerContent, SEND_RECORD, increaseTrySpeechCount, START_CHAT, failAIResponse, startChat, REQUEST_INTERVIEW } from '../slice';
import { ChatContentSpeakerType } from '../../../type';
import { STT_ERROR_TOAST, STT_NETWORK_ERROR_TOAST, } from '../constants';

afterEach(() => {
  jest.clearAllMocks();
});

describe('사용자 답변 녹음 에러 처리', () => {
  it('STT API 에러시 녹음 재요청 에러 토스트 메시지 표시', async () => {
    const setAddToastSpy = jest.spyOn(useToastStore.getState(), 'addToast');

    server.use(
      http.post('/api/chat', async ({ request }) => {
        return Response.json({ text: '' });
      })
    );

    const dispatched: any[] = [];
    const action = {
      type: SEND_RECORD,
      payload: {
        id: BigInt(1),
        formData: new FormData()
      }
    };

    await runSaga({
      dispatch: (action) => dispatched.push(action),
      getState: () => ({ chat: { id: 1, trySpeechCount: 0 } })
    }, speechToTextSaga, action).toPromise();

    expect(dispatched).toEqual([
      triggerContent({ speaker: ChatContentSpeakerType.user }),
      removeContent(),
      increaseTrySpeechCount(),
    ]);
    expect(setAddToastSpy).toHaveBeenCalledWith(STT_ERROR_TOAST);
  });

  it('STT API 에러 3회 까지는 녹음을 요청하고, 그 이후에는 네트워크 에러처리 하여 새로고침 유도', async () => {
    const setAddToastSpy = jest.spyOn(useToastStore.getState(), 'addToast');
    let attemptCount = 3;

    server.use(
      http.post('/api/chat', async ({ request }) => {
        return Response.json({ text: '' });
      })
    );

    const dispatched: any[] = [];
    const action = {
      type: SEND_RECORD,
      payload: {
        id: BigInt(1),
        formData: new FormData()
      }
    };

    for (let i = 0; i < 3; i++) {
      await runSaga({
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ chat: { id: 1, trySpeechCount: 0 } })
      }, speechToTextSaga, action).toPromise();

      expect(dispatched[i * 3]).toEqual(
        triggerContent({ speaker: ChatContentSpeakerType.user }),
      );
      expect(dispatched[i * 3 + 1]).toEqual(
        removeContent()
      );
      expect(dispatched[i * 3 + 2]).toEqual(
        increaseTrySpeechCount()
      );

      expect(setAddToastSpy).toHaveBeenCalledWith(STT_ERROR_TOAST);

      attemptCount++;
    }

    await runSaga({
      dispatch: (action) => dispatched.push(action),
      getState: () => ({ chat: { id: 1, trySpeechCount: attemptCount } })
    }, speechToTextSaga, action).toPromise();

    expect(setAddToastSpy).toHaveBeenCalledWith(STT_NETWORK_ERROR_TOAST);
  });
});

describe('AI 응답 에러 처리', () => {
  it('녹음된 답변을 전달 후 AI 응답 에러시, 메시지를 삭제하고 chat slice의 isAIResponseError 상태를 업데이트 한다.', async () => {
    server.use(
      http.post(`${baseURL}/interview/1/contents`, async ({ request }) => {
        return Response.json({ content: null });
      })
    );

    const dispatched: any[] = [];
    const action = {
      type: REQUEST_INTERVIEW,
      payload: {
        chatId: 1,
        content: 'test'
      }
    };

    await runSaga({
      dispatch: (action) => dispatched.push(action),
      getState: () => ({ chat: { id: 1, trySpeechCount: 0 } })
    }, requestInterviewSaga, action).toPromise();

    expect(dispatched).toEqual([
      triggerContent({ speaker: ChatContentSpeakerType.bot }),
      failAIResponse(),
      removeContent(),
    ]);
  });
});
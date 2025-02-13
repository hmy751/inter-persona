import { http } from 'msw';
import { baseURL } from '@/_apis/fetcher';
import { server } from '@/_mocks/server';
import { runSaga } from 'redux-saga';
import useToastStore from '@repo/store/useToastStore';

import { speechToTextSaga } from '@/_store/redux/features/chat/saga/speechToTextSaga';
import { cancelCurrentRequestInterviewSaga, requestInterviewSaga, retryInterviewSaga } from '@/_store/redux/features/chat/saga/requestInterviewSaga';
import { removeContent, triggerContent, SEND_RECORD, increaseTrySpeechCount, REQUEST_INTERVIEW, errorContent, updateContent, CANCEL_CURRENT_REQUEST_INTERVIEW, resetTrySpeechCount, RETRY_INTERVIEW, resetContentStatus } from '@/_store/redux/features/chat/slice';
import { ChatContentSpeakerType } from '@/_store/redux/type';
import { STT_ERROR_TOAST, STT_NETWORK_ERROR_TOAST, } from '@/_store/redux/features/chat/constants';

afterEach(() => {
  jest.clearAllMocks();
});

describe('사용자 답변 녹음, 비동기 통신 에러 처리 테스트', () => {
  it('STT API 에러시 녹음 재요청 토스트 메시지를 표시한다.', async () => {
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

  it('재요청 3회 이후에는 새로고침 토스트 메시지를 표시한다.', async () => {
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

describe('AI 응답 비동기 통신 에러 처리 테스트', () => {
  it('에러가 발생하면, 현재 진행중인 메시지를 삭제하고 이전 메시지의 에러상태를 업데이트 한다.', async () => {
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
      removeContent(),
      errorContent(),
    ]);
  });

  it('다시 시도하기 요청이 오면, 이전 사용자 답변 메시지를 이용하여 다시 요청한다.', async () => {
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

    const prevErrorDispatched = [
      triggerContent({ speaker: ChatContentSpeakerType.bot }),
      removeContent(),
      errorContent(),
    ]

    expect(dispatched).toEqual(prevErrorDispatched);

    server.use(
      http.post(`${baseURL}/interview/1/contents`, async ({ request }) => {
        return Response.json({ content: 'response success' });
      })
    );

    const retryAction = {
      type: RETRY_INTERVIEW,
      payload: {
        chatId: 1,
        content: 'test',
      }
    };

    await runSaga({
      dispatch: (action) => dispatched.push(action),
      getState: () => ({ chat: { id: 1, trySpeechCount: 0 } })
    }, retryInterviewSaga, retryAction).toPromise();

    expect(dispatched).toEqual([
      ...prevErrorDispatched,
      resetContentStatus(),
      triggerContent({ speaker: ChatContentSpeakerType.bot }),
      updateContent({ content: 'response success' }),
    ]);
  });

  it('취소하기 요청이 오면, 이전 메시지의 상태를 초기화 한다.', async () => {
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

    const prevErrorDispatched = [
      triggerContent({ speaker: ChatContentSpeakerType.bot }),
      removeContent(),
      errorContent(),
    ]

    expect(dispatched).toEqual(prevErrorDispatched);

    await runSaga({
      dispatch: (action) => dispatched.push(action),
      getState: () => ({ chat: { id: 1, trySpeechCount: 0 } })
    }, cancelCurrentRequestInterviewSaga).toPromise();

    expect(dispatched).toEqual([
      ...prevErrorDispatched,
      removeContent(),
      resetTrySpeechCount(),
    ]);
  });
});

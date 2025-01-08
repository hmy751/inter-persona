import { http } from 'msw';
import { server } from '@/mocks/server';
import { runSaga } from 'redux-saga';
import useToastStore from '@repo/store/useToastStore';

import { speechToTextSaga } from './saga';
import { removeContent, triggerContent, SEND_RECORD, increaseTrySpeechCount } from './slice';
import { ChatContentSpeakerType } from '../../type';

afterEach(() => {
  jest.clearAllMocks();
});

describe('사용자 답변 녹음 에러 처리', () => {
  it('STT API 에러시 상태 변화 확인', async () => {
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
    expect(setAddToastSpy).toHaveBeenCalledWith({
      title: 'STT API 에러',
      description: "음성이 제대로 입력되지 않았습니다. 답변을 다시 입력해주세요!",
      duration: 3000
    });
  });

  it('STT API 에러시 3회 시도까지는 녹음을 요청하고, 그 이상은 네트워크 에러처리 ', async () => {
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

      expect(setAddToastSpy).toHaveBeenCalledWith({
        title: 'STT API 에러',
        description: "음성이 제대로 입력되지 않았습니다. 답변을 다시 입력해주세요!",
        duration: 3000
      });

      attemptCount++;
    }

    await runSaga({
      dispatch: (action) => dispatched.push(action),
      getState: () => ({ chat: { id: 1, trySpeechCount: attemptCount } })
    }, speechToTextSaga, action).toPromise();

    expect(setAddToastSpy).toHaveBeenCalledWith({
      title: 'STT API 에러',
      description: "요청에 실패했습니다. 인터뷰를 다시 시도해주세요!",
      duration: 3000
    });
  });
});

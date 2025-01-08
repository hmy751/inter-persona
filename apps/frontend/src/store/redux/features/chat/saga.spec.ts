import { http } from 'msw';
import { server } from '@/mocks/server';
import { runSaga } from 'redux-saga';
import useToastStore from '@repo/store/useToastStore';

import { speechToTextSaga } from './saga';
import { removeContent, triggerContent, SEND_RECORD } from './slice';
import { ChatContentSpeakerType } from '../../type';

describe('사용자 답변 에러 처리', () => {
  it('STT API 에러시 상태 변화 확인', async () => {
    const setAddToastSpy = jest.spyOn(useToastStore.getState(), 'addToast');

    server.use(
      http.post('/api/chat', async ({ request }) => {
        return Response.json({ text: null });
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
      getState: () => ({ chat: { id: 1 } })
    }, speechToTextSaga, action).toPromise();

    expect(dispatched).toEqual([
      triggerContent({ speaker: ChatContentSpeakerType.user }),
      removeContent()
    ]);
    expect(setAddToastSpy).toHaveBeenCalledWith({
      title: 'STT API 에러',
      description: "음성이 제대로 입력되지 않았습니다. 답변을 다시 입력해주세요!",
      duration: 3000
    });
  });
});

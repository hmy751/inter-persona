import RecordButton from '@/_components/pages/interview/RecordButton/RecordButton';
import {
  IDLE_ICON_SRC,
  RECORDING_ICON_SRC,
  DISABLED_ICON_SRC,
} from '@/_components/pages/interview/RecordButton/constants';
import { screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SEND_RECORD } from '@/_store/redux/features/chat/slice';
import { ChatContentSpeakerType, ChatContentStatusType } from '@/_store/redux/type';
import Recorder from 'recorder-js';
import { mockStream, mockFormData } from '@/_tests/_mocks/window';
import { renderWithProviders } from '@/_tests/_mocks/providers';
import { createSuccessRecordingSetup, createTestSetup } from '@/_tests/_utils/recordingTest';
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('녹음 버튼 UI 상태 테스트', () => {
  it('초기에는 일반 버튼 상태로 시작한다.', async () => {
    renderWithProviders(<RecordButton />);

    const recordButton = screen.getByTestId('record-button');

    expect(recordButton.getAttribute('src')).toBe(IDLE_ICON_SRC);
  });

  it('녹음 버튼을 누르면, 녹음 상태로 변경된다.', async () => {
    renderWithProviders(<RecordButton />);

    const recordButton = screen.getByTestId('record-button');
    await userEvent.click(recordButton);

    expect(screen.getByTestId('record-button')).toHaveAttribute('src', RECORDING_ICON_SRC);
  });

  it('응답에 실패하면, 비활성 상태로 변경된다.', async () => {
    const preloadedState = {
      chat: {
        interviewId: 1,
        contents: [
          {
            status: ChatContentStatusType.fail,
            speaker: ChatContentSpeakerType.user,
            content: 'test',
            timeStamp: new Date(),
          },
        ],
        trySpeechCount: 0,
      },
    };

    renderWithProviders(<RecordButton />, { preloadedState });

    expect(await screen.findByTestId('record-button')).toHaveAttribute('src', DISABLED_ICON_SRC);
  });

  it('녹음이 완료되면 초기 일반 상태로 돌아간다.', async () => {
    renderWithProviders(<RecordButton />);

    const recordButton = screen.getByTestId('record-button');

    await userEvent.click(recordButton);

    waitFor(() => {
      expect(screen.getByTestId('record-button')).toHaveAttribute('src', RECORDING_ICON_SRC);
    });

    waitFor(() => {
      expect(screen.getByTestId('record-button')).toHaveAttribute('src', IDLE_ICON_SRC);
    });
  });
});

describe('녹음 프로세스 테스트', () => {
  describe('1. handleRecord', () => {
    describe('녹음 초기화 및 시작', () => {
      beforeEach(() => {
        renderWithProviders(<RecordButton />);
      });

      it('오디오 stream을 가져온다.', async () => {
        const recordButton = screen.getByTestId('record-button');
        await userEvent.click(recordButton);

        await waitFor(() => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
        });
      });

      it('음량 감지를 위한 analyser를 생성한다.', async () => {
        const recordButton = screen.getByTestId('record-button');
        await userEvent.click(recordButton);

        const audioContext = (window.AudioContext as unknown as jest.Mock).mock.instances[0];

        await waitFor(() => {
          expect(window.AudioContext).toHaveBeenCalledTimes(1);
          expect(audioContext.createAnalyser).toHaveBeenCalledTimes(1);
        });

        const analyserInstance = audioContext.createAnalyser();
        await waitFor(() => {
          expect(analyserInstance?.fftSize).toBe(2048);
        });
      });

      it('stream을 source로 변환하고 analyser에 연결한다.', async () => {
        const recordButton = screen.getByTestId('record-button');
        await userEvent.click(recordButton);

        const audioContext = (window.AudioContext as unknown as jest.Mock).mock.instances[0];

        await waitFor(() => {
          expect(audioContext.createMediaStreamSource).toHaveBeenCalledWith(mockStream);
        });
      });

      it('recorder를 생성 후 stream을 연결하고 초기화 한다.', async () => {
        const recordButton = screen.getByTestId('record-button');
        await userEvent.click(recordButton);
        const recorderInstance = (Recorder as unknown as jest.Mock).mock.instances[0];

        await waitFor(() => {
          expect(recorderInstance.init).toHaveBeenCalledWith(mockStream);
        });
      });

      it('recorder를 통해 녹음을 시작하고 상태를 recording으로 변경한다.', async () => {
        const recordButton = screen.getByTestId('record-button');
        await userEvent.click(recordButton);
        const recorderInstance = (Recorder as unknown as jest.Mock).mock.instances[0];

        await waitFor(() => {
          expect(recorderInstance.start).toHaveBeenCalled();
        });
      });
    });

    describe('음량 감지', () => {
      const testSetup = createTestSetup();

      beforeEach(() => {
        testSetup.setupRequestAnimationFrame();
      });

      afterEach(() => {
        testSetup.cleanup();
      });

      it('임계값 이상이면 500ms 후에도 녹음이 계속된다.', async () => {
        const recordButton = await testSetup.setupRecordingEnvironment();

        testSetup.config.currentData?.fill(180);

        await waitFor(() => {
          expect(recordButton).toHaveAttribute('src', RECORDING_ICON_SRC);
        });

        testSetup.advanceFramesAndTime(5, 100);

        await waitFor(() => {
          expect(recordButton).toHaveAttribute('src', RECORDING_ICON_SRC);
        });
      });

      it('임계값 이하이면 1초 후 녹음을 종료한다.', async () => {
        const recordButton = await testSetup.setupRecordingEnvironment();

        testSetup.config.currentData?.fill(180);

        await waitFor(() => {
          expect(recordButton).toHaveAttribute('src', RECORDING_ICON_SRC);
        });

        testSetup.config.currentData?.fill(128);

        testSetup.advanceFramesAndTime(12, 100);

        await waitFor(() => {
          expect(recordButton).toHaveAttribute('src', IDLE_ICON_SRC);
        });
      });
    });
  });

  describe('2. finishRecord', () => {
    const testSetup = createSuccessRecordingSetup();

    beforeEach(() => {
      testSetup.setupRequestAnimationFrame();
    });

    afterEach(() => {
      testSetup.cleanup();
    });

    it('녹음 완료 후, 생성된 파일이 올바른 WAV 형식인지 확인한다', async () => {
      await testSetup.setupSuccessRecordingEnvironment();

      const recorderInstance = (Recorder as unknown as jest.Mock).mock.instances[0];

      await waitFor(async () => {
        expect(recorderInstance.stop).toHaveBeenCalled();
        const { blob } = await recorderInstance.stop.mock.results[0]?.value;
        expect(blob.type).toBe('audio/wav');
      });
    });

    it('완성된 FormData를 Redux action을 통해 서버 전송을 요청한다', async () => {
      await testSetup.setupSuccessRecordingEnvironment();

      const mockDispatch = jest.spyOn(testSetup.config.store!, 'dispatch');

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: SEND_RECORD,
          payload: { formData: mockFormData },
        });
      });
    });
  });
});

const setAlertMock = jest.fn();

jest.mock('@repo/store/useAlertDialogStore', () => {
  const store = jest.fn(() => ({
    setAlert: setAlertMock,
  }));
  (store as any).getState = jest.fn(() => ({
    setAlert: setAlertMock,
  }));
  return store;
});

const confirmCallbackMock = jest.fn();
const setConfirmMock = jest.fn().mockImplementation((title, description, callback) => {
  if (callback) {
    confirmCallbackMock();
  }
});

jest.mock('@repo/store/useConfirmDialogStore', () => {
  const store = jest.fn(() => ({
    setConfirm: setConfirmMock,
  }));
  (store as any).getState = jest.fn(() => ({
    setConfirm: setConfirmMock,
  }));
  return store;
});

const addToastMock = jest.fn();

jest.mock('@repo/store/useToastStore', () => {
  const store = jest.fn(() => ({
    addToast: addToastMock,
  }));
  (store as any).getState = jest.fn(() => ({
    addToast: addToastMock,
  }));
  return store;
});

describe('녹음 프로세스 에러 처리 테스트', () => {
  describe('1. handleRecord 단계에서 발생하는 에러 처리', () => {
    beforeEach(() => {
      renderWithProviders(<RecordButton />);
    });

    it('권한 거부(NotAllowedError) 시, setAlert 호출한다.', async () => {
      (window.navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce({
        name: 'NotAllowedError',
        message: 'User denied mic permission',
      });

      const recordButton = screen.getByTestId('record-button');
      await userEvent.click(recordButton);

      await waitFor(() => {
        expect(setConfirmMock).toHaveBeenCalledTimes(1);
        expect(confirmCallbackMock).toHaveBeenCalledTimes(1);
      });
    });

    it('마이크 디바이스가 없을 때(NotFoundError) 시, setAlert 호출한다.', async () => {
      (window.navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce({
        name: 'NotFoundError',
        message: 'No microphone found',
      });

      // 녹음 버튼 클릭
      const recordButton = screen.getByTestId('record-button');
      await userEvent.click(recordButton);

      await waitFor(() => {
        expect(setAlertMock).toHaveBeenCalledTimes(1);
        expect(setAlertMock).toHaveBeenCalledWith(
          'Device Not Found',
          expect.stringContaining('마이크를 찾을 수 없습니다')
        );
      });
    });

    it('기타 알 수 없는 에러 발생 시, addToast 호출한다.', async () => {
      (window.navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce({
        name: 'RandomUnexpectedError',
        message: 'Some random error',
      });

      const recordButton = screen.getByTestId('record-button');
      await userEvent.click(recordButton);

      await waitFor(() => {
        expect(addToastMock).toHaveBeenCalledTimes(1);
        expect(addToastMock).toHaveBeenCalledWith({
          title: 'Unknown Error',
          description: expect.stringContaining('알 수 없는 오류가 발생했습니다'),
          duration: 3000,
        });
      });
    });
  });

  describe('2. finishRecord 단계에서 발생하는 에러 처리', () => {
    const testSetup = createSuccessRecordingSetup();

    beforeEach(() => {
      testSetup.setupRequestAnimationFrame();
    });

    afterEach(() => {
      testSetup.cleanup();
    });

    it('파일 크기가 너무 클 때(FILE_TOO_LARGE), addToast 호출한다.', async () => {
      const largeBlob = new Blob(['a'.repeat(60 * 1024 * 1024)], {
        type: 'audio/wav',
      });

      await testSetup.setupSuccessRecordingEnvironment();

      const recorderInstance = (Recorder as unknown as jest.Mock).mock.instances[0];

      recorderInstance.stop.mockResolvedValueOnce({ blob: largeBlob });

      await waitFor(() => {
        expect(recorderInstance.stop).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(addToastMock).toHaveBeenCalledTimes(1);
        expect(addToastMock).toHaveBeenCalledWith({
          title: 'File Too Large',
          description: expect.stringContaining('녹음 파일이 너무 큽니다'),
          duration: 3000,
        });
      });
    });

    it('알 수 없는 에러가 발생하면, addToast 호출한다.', async () => {
      await testSetup.setupSuccessRecordingEnvironment();
      const recorderInstance = (Recorder as unknown as jest.Mock).mock.instances[0];

      recorderInstance.stop.mockRejectedValueOnce(new Error('Unknown stop error'));

      await waitFor(() => {
        expect(recorderInstance.stop).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(addToastMock).toHaveBeenCalledTimes(1);
        expect(addToastMock).toHaveBeenCalledWith({
          title: '알 수 없는 오류',
          description: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
          duration: 3000,
        });
      });
    });
  });
});

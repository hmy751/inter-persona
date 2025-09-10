import RecordButton from '@/_components/pages/interview/RecordButton/RecordButton';
import {
  IDLE_ICON_SRC,
  RECORDING_ICON_SRC,
  DISABLED_ICON_SRC,
} from '@/_components/pages/interview/RecordButton/constants';
import { screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SEND_RECORD, ChatState } from '@/_store/redux/features/chat/slice';
import { ChatContentSpeakerType, ChatContentStatusType } from '@/_store/redux/type';
import { mockFormData, mockFile } from '@/_tests/_mocks/window';
import { renderWithProviders } from '@/_tests/_mocks/providers';
import { useMachine } from '@xstate/react';
import { RecordError, RecordErrorType } from '@/_libs/error/errors/RecordError';
import { errorService } from '@/_libs/error/service';

const mockUseGetInterview = jest.fn();
const setAlertMock = jest.fn();
const confirmCallbackMock = jest.fn();
const setConfirmMock = jest.fn().mockImplementation((title, description, callback) => {
  if (callback) {
    confirmCallbackMock();
  }
});
const addToastMock = jest.fn();

jest.mock('@xstate/react');
jest.mock('@/_libs/error/service', () => ({
  errorService: {
    handle: jest.fn(),
  },
}));
jest.mock('@/_data/interview', () => ({
  useGetInterview: () => mockUseGetInterview(),
}));

jest.mock('@repo/store/useAlertDialogStore', () => {
  const originalModule = jest.requireActual('@repo/store/useAlertDialogStore');
  return {
    __esModule: true,
    ...originalModule,
    default: Object.assign(
      jest.fn(() => ({ setAlert: setAlertMock })),
      {
        getState: () => ({ setAlert: setAlertMock }),
      }
    ),
  };
});
jest.mock('@repo/store/useConfirmDialogStore', () => {
  const originalModule = jest.requireActual('@repo/store/useConfirmDialogStore');
  return {
    __esModule: true,
    ...originalModule,
    default: Object.assign(
      jest.fn(() => ({
        setConfirm: setConfirmMock,
      })),
      {
        getState: () => ({
          setConfirm: setConfirmMock,
        }),
      }
    ),
  };
});
jest.mock('@repo/store/useToastStore', () => {
  const originalModule = jest.requireActual('@repo/store/useToastStore');
  return {
    __esModule: true,
    ...originalModule,
    default: Object.assign(
      jest.fn(() => ({ addToast: addToastMock })),
      {
        getState: () => ({ addToast: addToastMock }),
      }
    ),
  };
});

const mockUseMachine = useMachine as jest.Mock;
const mockSend = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('녹음 버튼 UI 상태 테스트', () => {
  beforeEach(() => {
    mockUseGetInterview.mockReturnValue({
      data: {
        interview: {
          status: 'ongoing',
          contents: [],
        },
      },
      isLoading: false,
    });
  });

  afterEach(() => {
    mockSend.mockClear();
    mockUseMachine.mockClear();
    mockUseGetInterview.mockClear();
  });

  it('머신이 idle 상태일 때, 기본 아이콘을 보여준다.', async () => {
    mockUseMachine.mockReturnValue([{ matches: (state: string) => state === 'idle', context: {} }, mockSend]);

    renderWithProviders(<RecordButton />);

    // screen.debug();

    const recordButton = await screen.findByTestId('record-button');

    expect(recordButton.getAttribute('src')).toBe(IDLE_ICON_SRC);
  });

  it('머신이 recording 상태일 때, 녹음 아이콘을 보여준다.', async () => {
    mockUseMachine.mockReturnValue([
      { matches: (state: { ready: 'recording' }) => state?.ready === 'recording', context: {} },
      mockSend,
    ]);

    renderWithProviders(<RecordButton />);

    const recordButton = await screen.findByTestId('record-button');

    await userEvent.click(recordButton);

    expect(screen.getByTestId('record-button')).toHaveAttribute('src', RECORDING_ICON_SRC);
  });

  it('isDisabledRecord가 true일 때, 비활성화 아이콘을 보여준다.', async () => {
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
        interviewStatus: 'ongoing',
      } as ChatState,
    };

    renderWithProviders(<RecordButton />, { preloadedState });

    expect(await screen.findByTestId('record-button')).toHaveAttribute('src', DISABLED_ICON_SRC);
  });

  it('머신이 recording 상태에서 버튼을 클릭하면, "STOP" 이벤트를 전송한다.', async () => {
    mockUseMachine.mockReturnValue([
      { matches: (state: { ready: 'recording' }) => state?.ready === 'recording', context: {} },
      mockSend,
    ]);

    renderWithProviders(<RecordButton />);

    const recordButton = await screen.findByTestId('record-button');

    await userEvent.click(recordButton);

    await waitFor(() => {
      expect(mockSend).toHaveBeenLastCalledWith({ type: 'STOP' });
    });
  });

  it('인터뷰가 완료되었을 때, "결과 보기" 버튼을 보여준다.', async () => {
    mockUseMachine.mockReturnValue([{ matches: (state: string) => state === 'idle', context: {} }, mockSend]);

    mockUseGetInterview.mockReturnValueOnce({
      data: {
        interview: {
          status: 'completed',
        },
      },
      isLoading: false,
    });

    renderWithProviders(<RecordButton />);

    const resultButton = await screen.findByTestId('result-button');

    expect(resultButton).toBeInTheDocument();
  });
});

describe('통합 및 예외처리 테스트', () => {
  beforeEach(() => {
    mockUseGetInterview.mockReturnValue({
      data: {
        interview: {
          status: 'ongoing',
          contents: [],
        },
      },
      isLoading: false,
    });
  });

  afterEach(() => {
    setAlertMock.mockClear();
    setConfirmMock.mockClear();
    confirmCallbackMock.mockClear();
    addToastMock.mockClear();
    mockSend.mockClear();
    mockUseGetInterview.mockClear();
  });

  it('머신이 uploading 상태이고 audioBlob이 있으면, SEND_RECORD 액션을 dispatch한다.', () => {
    mockUseMachine.mockReturnValue([
      {
        matches: (state: { ready: 'uploading' }) => state?.ready === 'uploading',
        context: { audioFile: mockFile, audioBlobSize: '1mb' },
      },
      mockSend,
    ]);

    const mockMediaFile = {
      name: 'recording.wav',
      type: 'audio/wav',
    };

    (mockFormData as any).get = jest.fn((key: string) => {
      if (key === 'media') {
        return mockMediaFile;
      }
      return null;
    });

    const { dispatchSpy } = renderWithProviders(<RecordButton />, { spyOnDispatch: true });

    if (!dispatchSpy) {
      throw new Error('dispatchSpy should be defined');
    }

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: SEND_RECORD,
      payload: { formData: mockFormData },
    });

    const dispatchedAction = dispatchSpy.mock.calls[0][0] as {
      payload: { formData: any };
    };
    const formData = dispatchedAction.payload.formData;
    const mediaFile = formData.get('media');

    expect(mediaFile.name).toBe('recording.wav');
    expect(mediaFile.type).toBe('audio/wav');
  });

  it('머신 context에 에러가 있으면, errorService를 호출한다.', async () => {
    const notFoundError = new RecordError({ type: RecordErrorType.DEVICE_NOT_FOUND });

    mockUseMachine.mockReturnValue([
      {
        matches: jest.fn().mockReturnValue(false),
        context: { error: notFoundError },
      },
      mockSend,
    ]);

    renderWithProviders(<RecordButton />);

    await waitFor(() => {
      expect(errorService.handle).toHaveBeenCalledWith(notFoundError, {
        type: 'toast',
        title: '녹음 에러',
        description: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });
    });
    expect(mockSend).toHaveBeenCalledWith({ type: 'CLEAR_ERROR' });
  });
});

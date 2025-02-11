import { configureStore } from "@reduxjs/toolkit";
import RecordButton from "@/_components/pages/chat/RecordButton/RecordButton";
import {
  IDLE_ICON_SRC,
  RECORDING_ICON_SRC,
  DISABLED_ICON_SRC,
} from "@/_components/pages/chat/RecordButton/constants";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, useDispatch } from "react-redux";
import chatReducer, { SEND_RECORD } from "@/_store/redux/features/chat/slice";
import {
  ChatContentSpeakerType,
  ChatContentStatusType,
} from "@/_store/redux/type";
import Recorder from "recorder-js";
import { mockStream, mockFormData } from "@/_tests/_mocks/window";

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("UI 상태 테스트", () => {
  it("초기에는 일반 버튼 상태로 시작한다.", () => {
    const store = configureStore({
      reducer: {
        chat: chatReducer,
      },
    });

    render(
      <Provider store={store}>
        <RecordButton />
      </Provider>
    );

    const recordButton = screen.getByTestId("record-button");

    expect(recordButton.getAttribute("src")).toBe(IDLE_ICON_SRC);
  });

  it("녹음 버튼을 누르면, 녹음 상태로 변경된다.", async () => {
    const store = configureStore({
      reducer: {
        chat: chatReducer,
      },
    });

    render(
      <Provider store={store}>
        <RecordButton />
      </Provider>
    );

    const recordButton = screen.getByTestId("record-button");
    await userEvent.click(recordButton);

    expect(screen.getByTestId("record-button")).toHaveAttribute(
      "src",
      RECORDING_ICON_SRC
    );
  });

  it("응답에 실패하면, 비활성 상태로 변경된다.", async () => {
    const store = configureStore({
      reducer: {
        chat: chatReducer,
      },
      preloadedState: {
        chat: {
          id: 1,
          contents: [
            {
              status: ChatContentStatusType.fail,
              speaker: ChatContentSpeakerType.user,
              content: "test",
              timeStamp: new Date(),
            },
          ],
          trySpeechCount: 0,
        },
      },
    });

    render(
      <Provider store={store}>
        <RecordButton />
      </Provider>
    );

    expect(await screen.findByTestId("record-button")).toHaveAttribute(
      "src",
      DISABLED_ICON_SRC
    );
  });

  it("녹음이 완료되면 초기 일반 상태로 돌아간다.", async () => {
    const store = configureStore({
      reducer: {
        chat: chatReducer,
      },
    });

    render(
      <Provider store={store}>
        <RecordButton />
      </Provider>
    );
    const recordButton = screen.getByTestId("record-button");

    await userEvent.click(recordButton);

    waitFor(() => {
      expect(screen.getByTestId("record-button")).toHaveAttribute(
        "src",
        RECORDING_ICON_SRC
      );
    });

    waitFor(() => {
      expect(screen.getByTestId("record-button")).toHaveAttribute(
        "src",
        IDLE_ICON_SRC
      );
    });
  });
});

describe("녹음 비즈니스 로직 테스트", () => {
  describe("개별 기능 테스트", () => {
    describe("녹음 시작 및 초기화", () => {
      beforeEach(() => {
        const store = configureStore({
          reducer: {
            chat: chatReducer,
          },
        });

        render(
          <Provider store={store}>
            <RecordButton />
          </Provider>
        );
      });

      it("오디오 stream을 가져온다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        await waitFor(() => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
        });
      });

      it("음량 감지를 위한 analyser를 생성한다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        const audioContext = (window.AudioContext as unknown as jest.Mock).mock
          .instances[0];

        await waitFor(() => {
          expect(window.AudioContext).toHaveBeenCalledTimes(1);
          expect(audioContext.createAnalyser).toHaveBeenCalledTimes(1);
        });

        const analyserInstance = audioContext.createAnalyser();
        await waitFor(() => {
          expect(analyserInstance?.fftSize).toBe(2048);
        });
      });

      it("stream을 source로 변환하고 analyser에 연결한다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        const audioContext = (window.AudioContext as unknown as jest.Mock).mock
          .instances[0];

        await waitFor(() => {
          expect(audioContext.createMediaStreamSource).toHaveBeenCalledWith(
            mockStream
          );
        });
      });

      it("recorder를 생성 후 stream을 연결하고 초기화 한다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);
        const recorderInstance = (Recorder as unknown as jest.Mock).mock
          .instances[0];

        await waitFor(() => {
          expect(recorderInstance.init).toHaveBeenCalledWith(mockStream);
        });
      });

      it("recorder를 통해 녹음을 시작하고 상태를 recording으로 변경한다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);
        const recorderInstance = (Recorder as unknown as jest.Mock).mock
          .instances[0];

        await waitFor(() => {
          expect(recorderInstance.start).toHaveBeenCalled();
        });
      });
    });

    describe("음량 감지 테스트", () => {
      let currentData: Uint8Array;
      let frameCallback: FrameRequestCallback | null = null;

      const setupRecordingEnvironment = async () => {
        const store = configureStore({
          reducer: {
            chat: chatReducer,
          },
        });

        render(
          <Provider store={store}>
            <RecordButton />
          </Provider>
        );

        const recordButton = await screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        currentData = new Uint8Array(2048);
        const audioContext = (window.AudioContext as unknown as jest.Mock).mock
          .instances[0];
        const analyserNode = audioContext.createAnalyser();

        analyserNode.getByteTimeDomainData.mockImplementation(
          (arr: Uint8Array) => {
            if (arr instanceof Uint8Array) {
              arr.set(currentData);
            }
          }
        );

        jest.useFakeTimers();

        if (frameCallback) frameCallback(0);
        return recordButton;
      };

      const advanceFramesAndTime = (frames: number, timePerFrame: number) => {
        for (let i = 0; i < frames; i++) {
          jest.advanceTimersByTime(timePerFrame);
          if (frameCallback) frameCallback(performance.now());
        }
      };

      beforeEach(() => {
        window.requestAnimationFrame = jest.fn(
          (callback: FrameRequestCallback) => {
            frameCallback = callback;
            return 1;
          }
        );
      });

      afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        frameCallback = null;
      });

      it("임계값 이상이면 500ms 후에도 녹음이 계속된다.", async () => {
        const recordButton = await setupRecordingEnvironment();
        // 높은 음량 설정
        currentData.fill(180);

        expect(recordButton).toHaveAttribute("src", RECORDING_ICON_SRC);

        // 시간 진행
        advanceFramesAndTime(5, 100); // 500ms

        expect(recordButton).toHaveAttribute("src", RECORDING_ICON_SRC);
      });

      it("임계값 이하이면 1초 후 녹음을 종료한다.", async () => {
        // 초기 높은 음량 설정
        const recordButton = await setupRecordingEnvironment();
        currentData.fill(180);

        expect(recordButton).toHaveAttribute("src", RECORDING_ICON_SRC);

        // 낮은 음량으로 변경
        currentData.fill(128);

        advanceFramesAndTime(12, 100); // 1200ms

        await waitFor(() => {
          expect(recordButton).toHaveAttribute("src", IDLE_ICON_SRC);
        });
      });
    });

    describe("녹음 완료 및 후처리", () => {
      let currentData: Uint8Array;
      let frameCallback: FrameRequestCallback | null = null;
      let mockDispatch: jest.Mock;

      const setupSuccessRecordingEnvironment = async () => {
        currentData.fill(128);

        const store = configureStore({
          reducer: {
            chat: chatReducer,
          },
        });

        mockDispatch = jest.spyOn(store, "dispatch") as jest.Mock;

        render(
          <Provider store={store}>
            <RecordButton />
          </Provider>
        );

        const recordButton = await screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        currentData = new Uint8Array(2048);

        const audioContext = (window.AudioContext as unknown as jest.Mock).mock
          .instances[0];
        const analyserNode = audioContext.createAnalyser();

        analyserNode.getByteTimeDomainData.mockImplementation(
          (arr: Uint8Array) => {
            if (arr instanceof Uint8Array) {
              arr.set(currentData);
            }
          }
        );

        jest.useFakeTimers();
        currentData.fill(128);

        advanceFramesAndTime(12, 100);

        if (frameCallback) frameCallback(0);
        return recordButton;
      };

      const advanceFramesAndTime = (frames: number, timePerFrame: number) => {
        for (let i = 0; i < frames; i++) {
          jest.advanceTimersByTime(timePerFrame);
          if (frameCallback) frameCallback(performance.now());
        }
      };

      beforeEach(() => {
        currentData = new Uint8Array(2048);

        window.requestAnimationFrame = jest.fn(
          (callback: FrameRequestCallback) => {
            frameCallback = callback;
            return 1;
          }
        );
      });

      afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        frameCallback = null;
      });

      it("녹음 완료 후, 생성된 파일이 올바른 WAV 형식인지 확인한다", async () => {
        await setupSuccessRecordingEnvironment();

        const recorderInstance = (Recorder as unknown as jest.Mock).mock
          .instances[0];

        await waitFor(async () => {
          expect(recorderInstance.stop).toHaveBeenCalled();
          const { blob } = await recorderInstance.stop.mock.results[0]?.value;
          expect(blob.type).toBe("audio/wav");
        });
      });

      it("완성된 FormData를 Redux action을 통해 서버 전송을 요청한다", async () => {
        await setupSuccessRecordingEnvironment();

        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledWith({
            type: SEND_RECORD,
            payload: { formData: mockFormData },
          });
        });
      });
    });
  });
});

const setAlertMock = jest.fn();
jest.mock("@repo/store/useAlertDialogStore", () => {
  return jest.fn().mockImplementation(() => ({
    setAlert: setAlertMock,
    setOpen: jest.fn(),
    clearAlert: jest.fn(),
  }));
});

jest.mock("@repo/store/useConfirmDialogStore", () => {
  return jest.fn().mockImplementation(() => ({
    setConfirm: jest.fn(),
  }));
});

const addToastMock = jest.fn();
jest.mock("@repo/store/useToastStore", () => {
  return jest.fn().mockImplementation(() => ({
    addToast: addToastMock,
  }));
});

describe("에러 처리 테스트", () => {
  let store: ReturnType<typeof configureStore>;

  describe("handleRecord 단계에서 발생하는 에러 처리", () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          chat: chatReducer,
        },
      });
    });

    it("권한 거부(NotAllowedError) 시, setAlert 호출한다.", async () => {
      (
        window.navigator.mediaDevices.getUserMedia as jest.Mock
      ).mockRejectedValue({
        name: "NotAllowedError",
        message: "User denied mic permission",
      });

      render(
        <Provider store={store}>
          <RecordButton />
        </Provider>
      );

      const recordButton = screen.getByTestId("record-button");
      await userEvent.click(recordButton);

      await waitFor(() => {
        expect(setAlertMock).toHaveBeenCalledTimes(1);
        expect(setAlertMock).toHaveBeenCalledWith(
          "Permission Denied",
          expect.stringContaining("마이크 사용 권한이 거부되었습니다")
        );
      });
    });

    it("마이크 디바이스가 없을 때(NotFoundError) 시, setAlert 호출한다.", async () => {
      (
        window.navigator.mediaDevices.getUserMedia as jest.Mock
      ).mockRejectedValue({
        name: "NotFoundError",
        message: "No microphone found",
      });

      render(
        <Provider store={store}>
          <RecordButton />
        </Provider>
      );

      // 녹음 버튼 클릭
      const recordButton = screen.getByTestId("record-button");
      await userEvent.click(recordButton);

      await waitFor(() => {
        expect(setAlertMock).toHaveBeenCalledTimes(1);
        expect(setAlertMock).toHaveBeenCalledWith(
          "Device Not Found",
          expect.stringContaining("마이크를 찾을 수 없습니다")
        );
      });
    });

    it("기타 알 수 없는 에러 발생 시, addToast 호출한다.", async () => {
      (
        window.navigator.mediaDevices.getUserMedia as jest.Mock
      ).mockRejectedValue({
        name: "RandomUnexpectedError",
        message: "Some random error",
      });

      render(
        <Provider store={store}>
          <RecordButton />
        </Provider>
      );

      const recordButton = screen.getByTestId("record-button");
      await userEvent.click(recordButton);

      await waitFor(() => {
        expect(addToastMock).toHaveBeenCalledTimes(1);
        expect(addToastMock).toHaveBeenCalledWith({
          title: "Unknown Error",
          description:
            expect.stringContaining("알 수 없는 오류가 발생했습니다"),
          duration: 3000,
        });
      });
    });
  });

  describe("finishRecord 단계에서 발생하는 에러 처리", () => {
    let currentData: Uint8Array;
    let frameCallback: FrameRequestCallback | null = null;
    let mockDispatch: jest.Mock;

    const setupSuccessRecordingEnvironment = async () => {
      const store = configureStore({
        reducer: {
          chat: chatReducer,
        },
      });

      mockDispatch = jest.spyOn(store, "dispatch") as jest.Mock;

      render(
        <Provider store={store}>
          <RecordButton />
        </Provider>
      );

      const recordButton = await screen.getByTestId("record-button");
      await userEvent.click(recordButton);
      currentData = new Uint8Array(2048);
      currentData.fill(128);

      const audioContext = (window.AudioContext as unknown as jest.Mock).mock
        .instances[0];
      const analyserNode = audioContext.createAnalyser();

      analyserNode.getByteTimeDomainData.mockImplementation(
        (arr: Uint8Array) => {
          if (arr instanceof Uint8Array) {
            arr.set(currentData);
          }
        }
      );

      jest.useFakeTimers();

      advanceFramesAndTime(12, 100);

      if (frameCallback) frameCallback(0);
      return recordButton;
    };

    const advanceFramesAndTime = (frames: number, timePerFrame: number) => {
      for (let i = 0; i < frames; i++) {
        jest.advanceTimersByTime(timePerFrame);
        if (frameCallback) frameCallback(performance.now());
      }
    };
    beforeEach(() => {
      (
        window.navigator.mediaDevices.getUserMedia as jest.Mock
      ).mockResolvedValue(mockStream);

      window.requestAnimationFrame = jest.fn(
        (callback: FrameRequestCallback) => {
          frameCallback = callback;
          return 1;
        }
      );
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
      frameCallback = null;
    });

    it("파일 크기가 너무 클 때(FILE_TOO_LARGE), addToast 호출한다.", async () => {
      const largeBlob = new Blob(["a".repeat(60 * 1024 * 1024)], {
        type: "audio/wav",
      });

      await setupSuccessRecordingEnvironment();

      const recorderInstance = (Recorder as unknown as jest.Mock).mock
        .instances[0];

      recorderInstance.stop.mockResolvedValueOnce({ blob: largeBlob });

      await waitFor(() => {
        expect(recorderInstance.stop).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(addToastMock).toHaveBeenCalledTimes(1);
        expect(addToastMock).toHaveBeenCalledWith({
          title: "File Too Large",
          description: expect.stringContaining("녹음 파일이 너무 큽니다"),
          duration: 3000,
        });
      });
    });

    it("알 수 없는 에러가 발생하면, addToast 호출한다.", async () => {
      await setupSuccessRecordingEnvironment();
      const recorderInstance = (Recorder as unknown as jest.Mock).mock
        .instances[0];

      recorderInstance.stop.mockRejectedValueOnce(
        new Error("Unknown stop error")
      );

      await waitFor(() => {
        expect(recorderInstance.stop).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(addToastMock).toHaveBeenCalledTimes(1);
        expect(addToastMock).toHaveBeenCalledWith({
          title: "알 수 없는 오류",
          description: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
          duration: 3000,
        });
      });
    });
  });
});

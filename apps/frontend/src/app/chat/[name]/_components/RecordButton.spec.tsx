import { configureStore } from "@reduxjs/toolkit";
import RecordButton, {
  IDLE_ICON_SRC,
  RECORDING_ICON_SRC,
  DISABLED_ICON_SRC,
  RecordingStatusType,
} from "./RecordButton";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, useSelector, useDispatch } from "react-redux";
import chatReducer from "@/store/redux/features/chat/slice";
import { ChatContentStatusType } from "@/store/redux/type";
import { selectCurrentRecordingAnswer } from "@/store/redux/features/chat/selector";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockRecorderInit = jest.fn().mockResolvedValue(undefined);
const mockRecorderStart = jest.fn().mockResolvedValue(undefined);
const mockRecorderStop = jest.fn().mockResolvedValue({
  blob: new Blob(["mock audio data"], { type: "audio/wav" }),
});

jest.mock("recorder-js", () => {
  return jest.fn().mockImplementation(() => ({
    init: mockRecorderInit,
    start: mockRecorderStart,
    stop: mockRecorderStop,
  }));
});

const mockStream = {};

Object.defineProperty(window, "navigator", {
  value: {
    mediaDevices: {
      getUserMedia: jest.fn().mockResolvedValue(mockStream),
    },
  },
});

const mockGetByteTimeDomainData = jest.fn();

const mockAudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn().mockImplementation(() => ({
    fftSize: 2048,
    getByteTimeDomainData: mockGetByteTimeDomainData,
  })),
  createMediaStreamSource: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
  })),
}));

Object.defineProperty(window, "AudioContext", {
  value: mockAudioContext,
});

describe("UI 상태 테스트", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("초기에는 일반 버튼 상태로 시작한다.", () => {
    render(<RecordButton />);

    const recordButton = screen.getByTestId("record-button");

    expect(recordButton.getAttribute("src")).toBe(IDLE_ICON_SRC);
  });

  it("녹음 버튼을 누르면, 녹음 상태로 변경된다.", async () => {
    render(<RecordButton />);

    const recordButton = screen.getByTestId("record-button");
    await userEvent.click(recordButton);

    expect(screen.getByTestId("record-button")).toHaveAttribute(
      "src",
      RECORDING_ICON_SRC
    );
  });

  it("응답에 실패하면, 비활성 상태로 변경된다.", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === selectCurrentRecordingAnswer) {
        return {
          status: ChatContentStatusType.fail,
        };
      }
      return null;
    });

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

    expect(await screen.findByTestId("record-button")).toHaveAttribute(
      "src",
      DISABLED_ICON_SRC
    );
  });

  it("녹음이 완료되면 초기 일반 상태로 돌아간다.", async () => {
    render(<RecordButton />);

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
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    describe("녹음 시작 및 초기화", () => {
      beforeEach(() => {
        render(<RecordButton />);
      });

      it("오디오 stream을 가져온다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        waitFor(() => {
          expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
        });
      });

      it("음량 감지를 위한 analyser를 생성한다.", async () => {
        const mockCreateAnalyser = jest.fn().mockImplementation(() => ({
          fftSize: 2048,
          getByteTimeDomainData: jest.fn(),
        }));

        const mockAudioContextInstance = {
          createAnalyser: mockCreateAnalyser,
          createMediaStreamSource: jest.fn().mockReturnValue({
            connect: jest.fn(),
          }),
        };

        (window.AudioContext as jest.Mock).mockImplementation(
          () => mockAudioContextInstance
        );

        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        waitFor(() => {
          expect(window.AudioContext).toHaveBeenCalledTimes(1);
          expect(mockCreateAnalyser).toHaveBeenCalledTimes(1);
        });

        const analyserInstance = mockCreateAnalyser.mock.results[0]?.value;
        waitFor(() => {
          expect(analyserInstance?.fftSize).toBe(2048);
        });
      });

      it("stream을 source로 변환하고 analyser에 연결한다.", async () => {
        const mockSource = {
          connect: jest.fn(),
        };

        const mockCreateMediaStreamSource = jest
          .fn()
          .mockImplementation(() => mockSource);

        const mockAnalyserNode = {
          fftSize: 2048,
          getByteTimeDomainData: jest.fn(),
        };

        const mockAudioContextInstance = {
          createAnalyser: jest.fn().mockImplementation(() => mockAnalyserNode),
          createMediaStreamSource: mockCreateMediaStreamSource,
        };

        (window.AudioContext as jest.Mock).mockImplementation(
          () => mockAudioContextInstance
        );

        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        waitFor(() => {
          expect(mockSource.connect).toHaveBeenCalledWith(mockAnalyserNode);
        });
      });

      it("recorder를 생성 후 stream을 연결하고 초기화 한다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        waitFor(() => {
          expect(mockRecorderInit).toHaveBeenCalledWith(mockStream);
        });
      });

      it("recorder를 통해 녹음을 시작하고 상태를 recording으로 변경한다.", async () => {
        const recordButton = screen.getByTestId("record-button");
        await userEvent.click(recordButton);

        waitFor(() => {
          expect(mockRecorderStart).toHaveBeenCalled();
        });
      });
    });

    describe("음량 감지 테스트", () => {
      let currentData: Uint8Array;
      let frameCallback: FrameRequestCallback | null = null;

      beforeEach(() => {
        currentData = new Uint8Array(2048);

        mockGetByteTimeDomainData.mockImplementation((arr: Uint8Array) => {
          if (arr instanceof Uint8Array) {
            arr.set(currentData);
          }
        });

        window.requestAnimationFrame = jest.fn(
          (callback: FrameRequestCallback) => {
            frameCallback = callback;
            return 1;
          }
        );

        (useDispatch as unknown as jest.Mock).mockImplementation(() =>
          jest.fn()
        );
      });

      afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        frameCallback = null;
      });

      const setupRecordingEnvironment = async () => {
        render(<RecordButton />);
        const recordButton = await screen.getByTestId("record-button");
        await userEvent.click(recordButton);
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

      it("임계값 이상이면 500ms 후에도 녹음이 계속된다.", async () => {
        // 높은 음량 설정
        currentData.fill(180);

        const recordButton = await setupRecordingEnvironment();

        expect(recordButton).toHaveAttribute("src", RECORDING_ICON_SRC);

        // 시간 진행
        advanceFramesAndTime(5, 100); // 500ms

        expect(recordButton).toHaveAttribute("src", RECORDING_ICON_SRC);
      });

      it("임계값 이하이면 1초 후 녹음을 종료한다.", async () => {
        // 초기 높은 음량 설정
        currentData.fill(180);

        const recordButton = await setupRecordingEnvironment();
        expect(recordButton).toHaveAttribute("src", RECORDING_ICON_SRC);

        // 낮은 음량으로 변경
        currentData.fill(128);

        advanceFramesAndTime(12, 100); // 1200ms

        await waitFor(() => {
          expect(recordButton).toHaveAttribute("src", IDLE_ICON_SRC);
        });
      });
    });
  });
});

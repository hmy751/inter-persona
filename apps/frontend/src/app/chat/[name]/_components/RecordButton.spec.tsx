import { configureStore } from "@reduxjs/toolkit";
import RecordButton, {
  IDLE_ICON_SRC,
  RECORDING_ICON_SRC,
  DISABLED_ICON_SRC,
  RecordingStatusType,
} from "./RecordButton";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, useSelector } from "react-redux";
import chatReducer from "@/store/redux/features/chat/slice";
import { ChatContentStatusType } from "@/store/redux/type";
import { selectCurrentRecordingAnswer } from "@/store/redux/features/chat/selector";

const mockDetectSilence = jest.fn();
jest.mock("@/app/chat/[name]/_utils", () => ({
  detectSilence: () => mockDetectSilence(), // 함수로 한번 감싸기, 호이스팅 에러
}));

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

const mockAudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn().mockImplementation(() => ({
    fftSize: 2048,
    getByteTimeDomainData: jest.fn(),
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
    mockDetectSilence.mockImplementation(
      (analyser, dataArray, setRecordingStatus) => {
        setTimeout(() => {
          setRecordingStatus(RecordingStatusType.finished);
        }, 100);
      }
    );

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
    describe("녹음 시작 및 초기화", () => {
      beforeEach(async () => {
        render(<RecordButton />);
      });

      afterEach(() => {
        jest.clearAllMocks();
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

    // describe("음량 감지 테스트", () => {
    //   let mockAnalyser: Partial<AnalyserNode>;
    //   let mockDataArray: Uint8Array;
    //   let mockSetIsRecording: jest.Mock;

    //   beforeEach(() => {
    //     jest.useFakeTimers(); // requestAnimationFrame이 내부적으로 동작하므로 타이머를 모킹
    //     mockAnalyser = {
    //       getByteTimeDomainData: jest.fn(),
    //     };
    //     mockDataArray = new Uint8Array(2048); // fftSize 2048 기준
    //     mockSetIsRecording = jest.fn();
    //   });

    //   afterEach(() => {
    //     jest.clearAllMocks();
    //     jest.clearAllTimers();
    //     jest.useRealTimers();
    //   });

    //   it("음량을 감지하여 임계값 이상이면 녹음을 계속한다.", async () => {
    //     render(<RecordButton />);
    //     await userEvent.click(screen.getByTestId("record-button"));

    //     // RMS를 계산할 때 dataArray가 모두 128(center)보다 크게 만들어
    //     // 항상 임계값 이상으로 나오도록 세팅
    //     // (128은 getByteTimeDomainData로 가져온 값에서 128 기준 0이 되는 음성 신호)
    //     mockDataArray.fill(180);

    //     // getByteTimeDomainData를 호출하면 mockDataArray가 반환되도록 처리
    //     (mockAnalyser.getByteTimeDomainData as jest.Mock).mockImplementation(
    //       (arr: Uint8Array) => {
    //         arr.set(mockDataArray);
    //       }
    //     );

    //     // detectSilence(
    //     //   mockAnalyser as AnalyserNode,
    //     //   mockDataArray,
    //     //   mockSetIsRecording,
    //     //   /* silenceThreshold= */ 0.01,
    //     //   /* timeout= */ 1000
    //     // );

    //     // requestAnimationFrame 콜백이 여러 번 실행되도록 강제
    //     // 일반적으로는 animation frame 마다 한 번씩 실행될 것이지만,
    //     // 테스트에서는 적절히 여러 번 호출 시뮬레이션
    //     for (let i = 0; i < 10; i++) {
    //       jest.advanceTimersByTime(16); // 대략 1 frame(16ms 가정)
    //     }

    //     // RMS가 계속 임계값 이상이므로
    //     // setIsRecording(RecordingStatusType.finished)가 절대 호출되지 않아야 함
    //     waitFor(() => {
    //       expect(mockSetIsRecording).not.toHaveBeenCalled();
    //     });
    //   });

    //   it("음량을 감지하여 임계값 이하면 녹음을 완료한다.", async () => {
    //     // 이번엔 RMS가 아주 낮게 계산되도록 128보다 모두 같거나 낮은 값을 채워넣기
    //     // -> (128/128 - 1) => 0 ~ -1 사이에서 RMS가 매우 낮게 계산되도록
    //     mockDataArray.fill(128);

    //     // getByteTimeDomainData를 호출하면 mockDataArray가 반환되도록 처리
    //     (mockAnalyser.getByteTimeDomainData as jest.Mock).mockImplementation(
    //       (arr: Uint8Array) => {
    //         arr.set(mockDataArray);
    //       }
    //     );

    //     // detectSilence(
    //     //   mockAnalyser as AnalyserNode,
    //     //   mockDataArray,
    //     //   mockSetIsRecording,
    //     //   /* silenceThreshold= */ 0.01,
    //     //   /* timeout= */ 1000
    //     // );

    //     // 시간 경과를 시뮬레이트 하기 위해 타이머를 forward
    //     // 1초(1000ms) 이상 음성이 임계값 이하 상태가 유지되면 finished 호출
    //     jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    //       return setTimeout(cb, 0);
    //     });

    //     render(<RecordButton />);
    //     await userEvent.click(screen.getByTestId("record-button"));

    //     jest.advanceTimersByTime(1001);

    //     expect(mockSetIsRecording).toHaveBeenCalledWith(
    //       RecordingStatusType.finished
    //     );
    //   });

    //   it("녹음 완료 시 녹음 상태를 finished로 변경한다.", async () => {});
    // });
  });
});

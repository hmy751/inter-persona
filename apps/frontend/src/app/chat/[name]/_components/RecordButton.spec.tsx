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

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("recorder-js", () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue({
      blob: new Blob(["mock audio data"], { type: "audio/wav" }),
    }),
  }));
});

Object.defineProperty(window, "navigator", {
  value: {
    mediaDevices: {
      getUserMedia: jest.fn().mockResolvedValue({
        audio: true,
      }),
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
    render(<RecordButton />);

    const recordButton = screen.getByTestId("record-button");

    await userEvent.click(recordButton);

    waitFor(() => {
      expect(screen.getByTestId("record-button")).toHaveAttribute(
        "src",
        RECORDING_ICON_SRC
      );
    });

    jest.mock("../_utils", () => ({
      detectSilence: jest
        .fn()
        .mockImplementation((analyser, dataArray, setRecordingStatus) => {
          setTimeout(() => {
            setRecordingStatus(RecordingStatusType.finished);
          }, 100);
        }),
    }));

    waitFor(() => {
      expect(screen.getByTestId("record-button")).toHaveAttribute(
        "src",
        IDLE_ICON_SRC
      );
    });
  });
});

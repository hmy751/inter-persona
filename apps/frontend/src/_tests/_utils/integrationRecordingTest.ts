import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * 통합 테스트 환경에서 녹음/STT 프로세스를 시뮬레이션하기 위한 구성 객체
 */
export type IntegrationRecordingConfig = {
  currentData: Uint8Array;
  frameCallback: FrameRequestCallback | null;
};

/**
 * 통합 테스트용 녹음 프로세스 시뮬레이션 유틸
 * - triggerRecording: 이미 렌더링된 InterviewPage에서 녹음 버튼 클릭
 * - setupRequestAnimationFrame: requestAnimationFrame을 모킹하여 타이머 진행 제어
 * - advanceFramesAndTime: 지정한 프레임 수만큼 타이머를 전진시키고 frameCallback 실행
 * - simulateRecordingFlow: 타이머와 데이터 목킹으로, 녹음 상태와 STT 단계를 시뮬레이션
 * - cleanup: 타이머 및 내부 상태 초기화
 */
export const createIntegrationRecordingSetup = () => {
  const config: IntegrationRecordingConfig = {
    currentData: new Uint8Array(2048).fill(128),
    frameCallback: null,
  };


  /**
   * requestAnimationFrame을 모킹하여 테스트에서 타이머 콜백을 직접 제어합니다.
   */
  const setupRequestAnimationFrame = () => {
    window.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      config.frameCallback = callback;
      return 1;
    });
  };

  /**
   * 현재 렌더된 페이지에서 녹음 버튼을 찾아 클릭하여 녹음을 시작합니다.
   */
  const triggerRecording = async () => {
    const setupAnalyserNode = (audioContext: AudioContext) => {
      const analyserNode = audioContext.createAnalyser();
      (analyserNode.getByteTimeDomainData as jest.Mock).mockImplementation(
        (arr: Uint8Array) => {
          if (arr instanceof Uint8Array && config.currentData) {
            arr.set(config.currentData);
          }
        }
      );
      return analyserNode;
    };

    const recordButton = await screen.findByTestId("record-button");
    await userEvent.click(recordButton);

    if (config.currentData) {
      const audioContext = (window.AudioContext as unknown as jest.Mock).mock
        .instances[0];
      setupAnalyserNode(audioContext);
    }


    return recordButton;
  };

  /**
   * 지정한 프레임 수와 프레임 당 시간(ms)만큼 타이머를 전진시키며, requestAnimationFrame 콜백을 실행합니다.
   */
  const advanceFramesAndTime = (frames: number, timePerFrame: number) => {
    for (let i = 0; i < frames; i++) {
      jest.advanceTimersByTime(timePerFrame);
      if (config.frameCallback) {
        config.frameCallback(performance.now());
      }
    }
  };

  /**
   * 녹음 진행 중 STT 프로세스를 시뮬레이션합니다.
   */
  const simulateRecordingFlow = () => {
    jest.useFakeTimers();
    config.currentData.fill(128);
    advanceFramesAndTime(12, 20000);
  };

  /**
   * 테스트 후 타이머와 내부 상태를 초기화합니다.
   */
  const cleanup = () => {
    jest.clearAllTimers();
    jest.useRealTimers();
    config.frameCallback = null;
    config.currentData = new Uint8Array(2048);
  };

  return {
    config,
    setupRequestAnimationFrame,
    triggerRecording,
    advanceFramesAndTime,
    simulateRecordingFlow,
    cleanup,
  };
}; 
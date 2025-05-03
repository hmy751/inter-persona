import { renderWithProviders } from '@/_tests/_mocks/providers';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecordButton from '@/_components/pages/interview/RecordButton/RecordButton';
import { AppStore } from '@/_store/redux/rootStore';

export type TestSetupConfig = {
  currentData?: Uint8Array;
  frameCallback?: FrameRequestCallback | null;
  store: AppStore | null;
};

export const createTestSetup = () => {
  const config: TestSetupConfig = {
    currentData: new Uint8Array(2048),
    frameCallback: null,
    store: null,
  };

  const setupRequestAnimationFrame = () => {
    window.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      config.frameCallback = callback;
      return 1;
    });
  };

  /**
   * 녹음 환경 설정, 순서가 매우 중요하다.
   */
  const setupRecordingEnvironment = async () => {
    const setupAnalyserNode = (audioContext: AudioContext) => {
      const analyserNode = audioContext.createAnalyser();
      (analyserNode.getByteTimeDomainData as jest.Mock).mockImplementation((arr: Uint8Array) => {
        if (arr instanceof Uint8Array && config.currentData) {
          arr.set(config.currentData);
        }
      });
      return analyserNode;
    };

    const { store } = renderWithProviders(<RecordButton />);
    config.store = store;

    const recordButton = await screen.getByTestId('record-button');
    await userEvent.click(recordButton);

    if (config.currentData) {
      const audioContext = (window.AudioContext as unknown as jest.Mock).mock.instances[0];
      setupAnalyserNode(audioContext);
    }

    jest.useFakeTimers();
    if (config.frameCallback) config.frameCallback(0);

    return recordButton;
  };

  const advanceFramesAndTime = (frames: number, timePerFrame: number) => {
    for (let i = 0; i < frames; i++) {
      jest.advanceTimersByTime(timePerFrame);
      if (config.frameCallback) config.frameCallback(performance.now());
    }
  };

  const cleanup = () => {
    jest.clearAllTimers();
    jest.useRealTimers();
    config.frameCallback = null;
    config.currentData = new Uint8Array(2048);
    config.store = null;
  };

  return {
    config,
    setupRequestAnimationFrame,
    setupRecordingEnvironment,
    advanceFramesAndTime,
    cleanup,
  };
};

export const createSuccessRecordingSetup = () => {
  const setup = createTestSetup();

  const setupSuccessRecordingEnvironment = async () => {
    if (setup.config.currentData) {
      setup.config.currentData.fill(128);
    }

    const recordButton = await setup.setupRecordingEnvironment();
    setup.advanceFramesAndTime(12, 100);

    return recordButton;
  };

  return {
    ...setup,
    setupSuccessRecordingEnvironment,
  };
};

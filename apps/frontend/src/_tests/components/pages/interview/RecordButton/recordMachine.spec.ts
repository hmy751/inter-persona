import { createActor } from 'xstate';
import { recordMachine } from '@/_components/pages/interview/RecordButton/recordMachine';
import { detectSilence } from '@/_components/pages/interview/RecordButton/utils';
import Recorder from 'recorder-js';
import { mockGetUserMedia, resetMediaDevicesMock } from '@/_tests/_mocks/window';

jest.mock('recorder-js');
const MockRecorder = Recorder as unknown as jest.Mock;

jest.mock('@/_components/pages/interview/RecordButton/utils', () => ({
  detectSilence: jest.fn(() => () => {}),
}));

describe('recordMachine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMediaDevicesMock();
  });

  it('초기 상태는 "idle"이어야 한다.', () => {
    const actor = createActor(recordMachine).start();
    expect(actor.getSnapshot().value).toBe('idle');
  });

  it('AudioContext 설정이 실패하면 "failure" 상태로 전환된다.', async () => {
    const setupError = new Error('AudioContext not supported');
    (window.AudioContext as jest.Mock).mockImplementationOnce(() => {
      throw setupError;
    });

    const actor = createActor(recordMachine).start();
    actor.send({ type: 'SETUP' });

    await new Promise(process.nextTick);

    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('failure');
    expect(snapshot.context.error).toBe(setupError);
  });

  it('성공 시나리오: SETUP -> RECORD -> STOP -> COMPLETED 흐름으로 이루어진다.', async () => {
    const actor = createActor(recordMachine).start();

    actor.send({ type: 'SETUP' });
    await new Promise(process.nextTick);

    let snapshot = actor.getSnapshot();
    expect(snapshot.value).toEqual({ ready: 'waitingForRecord' });
    expect(snapshot.context.audioContext).not.toBeNull();
    expect(snapshot.context.analyserNode).not.toBeNull();

    actor.send({ type: 'RECORD' });
    await new Promise(process.nextTick);

    snapshot = actor.getSnapshot();

    expect(snapshot.value).toEqual({ ready: 'recording' });
    expect(snapshot.context.stream).not.toBeNull();
    expect(snapshot.context.recorder).not.toBeNull();
    expect(MockRecorder).toHaveBeenCalledWith(snapshot.context.audioContext);
    const recorderInstance = MockRecorder.mock.instances[0];
    expect(recorderInstance.init).toHaveBeenCalledWith(snapshot.context.stream);
    expect(recorderInstance.start).toHaveBeenCalled();

    expect(detectSilence).toHaveBeenCalled();

    const mockBlob = new Blob(['audio-data'], { type: 'audio/wav' });
    const recorderInstanceStop = MockRecorder.mock.instances[0].stop as jest.Mock;
    recorderInstanceStop.mockResolvedValue({ blob: mockBlob });

    actor.send({ type: 'STOP' });
    await new Promise(process.nextTick);

    snapshot = actor.getSnapshot();
    expect(snapshot.value).toEqual({ ready: 'uploading' });
    expect(snapshot.context.audioBlob).toBe(mockBlob);

    actor.send({ type: 'COMPLETED' });
    await new Promise(process.nextTick);

    snapshot = actor.getSnapshot();
    expect(snapshot.value).toEqual({ ready: 'waitingForRecord' });

    expect(snapshot.context.audioBlob).toBeNull();
    expect(snapshot.context.stream).toBeNull();
    expect(snapshot.context.recorder).toBeNull();
  });

  it('마이크 권한을 거부하면 에러 처리 후 대기 상태로 돌아간다.', async () => {
    const actor = createActor(recordMachine);
    actor.start();
    actor.send({ type: 'SETUP' });
    await new Promise(process.nextTick);
    expect(actor.getSnapshot().value).toEqual({ ready: 'waitingForRecord' });

    const permissionError = new Error('Permission denied');
    mockGetUserMedia.mockRejectedValue(permissionError);

    actor.send({ type: 'RECORD' });
    await new Promise(process.nextTick);

    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toEqual({ ready: 'waitingForRecord' });
    expect(snapshot.context.error).toBe(permissionError);
    expect(snapshot.context.stream).toBeNull();
  });

  it('CLEAR_ERROR 이벤트를 받으면 컨텍스트의 에러를 초기화해야 한다.', async () => {
    const actor = createActor(recordMachine);
    actor.start();
    actor.send({ type: 'SETUP' });
    await new Promise(process.nextTick);

    const permissionError = new Error('Permission denied');
    mockGetUserMedia.mockRejectedValue(permissionError);
    actor.send({ type: 'RECORD' });
    await new Promise(process.nextTick);

    expect(actor.getSnapshot().context.error).toBe(permissionError);

    actor.send({ type: 'CLEAR_ERROR' });

    expect(actor.getSnapshot().context.error).toBeNull();
  });
});

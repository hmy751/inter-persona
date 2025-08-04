import { assign, fromPromise, fromCallback, setup } from 'xstate';
import Recorder from 'recorder-js';
import { detectSilence } from './utils';
import { AppError } from '@/_libs/error/errors';

export type RecordContext = {
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
  stream: MediaStream | null;
  recorder: Recorder | null;
  audioBlob: Blob | null;
  error: Error | AppError | null;
};

type RecordEvent =
  | { type: 'SETUP' }
  | { type: 'RECORD' }
  | { type: 'STOP' }
  | {
      type: 'initializeAudioContext.onDone';
      output: { audioContext: AudioContext; analyserNode: AnalyserNode };
    }
  | { type: 'initializeAudioContext.onError'; error: Error }
  | { type: 'getMediaStreamAndConnectSourceNode.onDone'; output: MediaStream }
  | { type: 'getMediaStreamAndConnectSourceNode.onError'; error: Error }
  | { type: 'stopAndGetBlob.onDone'; output: Blob }
  | { type: 'stopAndGetBlob.onError'; error: Error }
  | { type: 'COMPLETED' }
  | { type: 'FAILED' }
  | { type: 'CLEAR_ERROR' };

export const recorderActors = {
  initializeAudioContext: fromPromise(async () => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    return { audioContext, analyserNode };
  }),
  getMediaStreamAndConnectSourceNode: fromPromise(
    async ({ input }: { input: { audioContext: AudioContext; analyserNode: AnalyserNode } }) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sourceNode = input.audioContext!.createMediaStreamSource(stream);
      sourceNode.connect(input.analyserNode!);
      return stream;
    }
  ),
  stopAndGetBlob: fromPromise(async ({ input }: { input: { recorder: Recorder } }) => {
    const { blob } = await input.recorder.stop();
    return blob;
  }),
  detectSilence: fromCallback(({ sendBack, input }) => {
    const { analyser, options } = input as {
      analyser: AnalyserNode;
      options?: { silenceThreshold?: number; timeout?: number };
    };
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const onSilence = () => sendBack({ type: 'STOP' });

    const cleanup = detectSilence(analyser, dataArray, onSilence, options);
    return cleanup;
  }),
};

export const recordMachine = setup({
  // setup을 사용할 시 주의사항은 클라이언트나 서버사이드 렌더링 환경을 꼭 고려해야한다.
  types: {
    context: {} as RecordContext,
    events: {} as RecordEvent,
  },
  actors: {
    ...recorderActors,
  },
  actions: {
    cleanupRecorderStream: assign({
      stream: null,
      recorder: null,
    }),
    clearError: assign({
      error: null,
    }),
  },
}).createMachine({
  id: 'recordButton',
  context: {
    // settingUp, 재사용
    audioContext: null,
    analyserNode: null,
    // 매 녹음마다 초기화
    stream: null,
    recorder: null,
    audioBlob: null,
    error: null,
  },
  initial: 'idle',
  states: {
    idle: { on: { SETUP: 'settingUp' } },
    settingUp: {
      invoke: {
        id: 'initializeAudioContext',
        src: 'initializeAudioContext',
        onDone: {
          target: 'ready',
          actions: assign({
            audioContext: ({ event }) => event.output.audioContext,
            analyserNode: ({ event }) => event.output.analyserNode,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({ error: ({ event }) => event.error as Error }),
        },
      },
    },
    ready: {
      on: {
        CLEAR_ERROR: {
          actions: ['clearError'],
        },
      },
      initial: 'waitingForRecord',
      states: {
        waitingForRecord: {
          on: { RECORD: 'gettingPermission' },
        },
        gettingPermission: {
          invoke: {
            id: 'getMediaStreamAndConnectSourceNode',
            src: 'getMediaStreamAndConnectSourceNode',
            input: ({ context }) => ({ analyserNode: context.analyserNode!, audioContext: context.audioContext! }),
            onDone: {
              target: 'recording',
              actions: assign({ stream: ({ event }) => event.output }),
            },
            onError: {
              target: 'waitingForRecord',
              actions: assign({ error: ({ event }) => event.error as Error }),
            },
          },
        },
        recording: {
          entry: assign({
            recorder: ({ context }) => {
              const recorder = new Recorder(context.audioContext!);
              recorder.init(context.stream!);
              recorder.start();
              return recorder;
            },
          }),
          invoke: {
            src: 'detectSilence',
            input: ({ context }) => ({ analyser: context.analyserNode! }),
          },
          exit: [
            ({ context }) => {
              context.stream?.getTracks().forEach(track => track.stop());
            },
            'cleanupRecorderStream',
          ],
          on: { STOP: 'processing' },
        },
        processing: {
          invoke: {
            id: 'stopAndGetBlob',
            src: 'stopAndGetBlob',
            input: ({ context }) => ({ recorder: context.recorder! }),
            onDone: {
              target: 'uploading',
              actions: assign({ audioBlob: ({ event }) => event.output }),
            },
            onError: {
              target: 'waitingForRecord',
              actions: assign({ error: ({ event }) => event.error as Error }),
            },
          },
        },
        uploading: {
          on: {
            COMPLETED: 'waitingForRecord',
            FAILED: 'waitingForRecord',
          },
          exit: assign({ audioBlob: () => null }),
        },
      },
    },
    failure: { type: 'final' },
  },
});

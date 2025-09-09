import { assign, fromPromise, fromCallback, setup } from 'xstate';
import Recorder from 'recorder-js';
import { detectSilence } from './utils';
import { AppError } from '@/_libs/error/errors';
import { RecordError, RecordErrorType } from '@/_libs/error/errors/RecordError';

export type RecordContext = {
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
  stream: MediaStream | null;
  recorder: Recorder | null;
  audioFile: File | null;
  audioBlobSize: number | null;
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
  | { type: 'stopAndGetBlob.onDone'; output: { audioFile: File; blobSize: number } }
  | { type: 'stopAndGetBlob.onError'; error: Error }
  | { type: 'COMPLETED' }
  | { type: 'FAILED' }
  | { type: 'CLEAR_ERROR' };

export const recorderActors = {
  initializeAudioContext: fromPromise(async () => {
    try {
      const audioContext = new window.AudioContext();
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      return { audioContext, analyserNode };
    } catch (error) {
      throw new RecordError({ type: RecordErrorType.CONTEXT_NOT_ALLOWED });
    }
  }),
  getMediaStreamAndConnectSourceNode: fromPromise(
    async ({ input }: { input: { audioContext: AudioContext; analyserNode: AnalyserNode } }) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new RecordError({ type: RecordErrorType.API_NOT_SUPPORTED });
      }
      const { audioContext, analyserNode } = input;
      if (!audioContext || !analyserNode) {
        throw new AppError({ message: 'Audio context or analyser node not initialized', data: null });
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error: unknown) {
        if (error instanceof Error) {
          switch (error.name) {
            case 'NotAllowedError':
              throw new RecordError({ type: RecordErrorType.PERMISSION_DENIED });
            case 'NotFoundError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_FOUND });
            case 'NotReadableError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
            case 'TrackStartError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
            case 'OverconstrainedError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_FOUND });
            default:
              throw error;
          }
        }
        throw error;
      }

      try {
        const sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode);
      } catch (error: unknown) {
        throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
      }

      return stream;
    }
  ),
  stopAndGetBlob: fromPromise(async ({ input }: { input: { recorder: Recorder } }) => {
    const { blob } = await input.recorder.stop();
    if (blob.size > 50 * 1024 * 1024) {
      throw new RecordError({ type: RecordErrorType.FILE_TOO_LARGE });
    }
    const audioFile = new File([blob], 'recording.wav', { type: 'audio/wav' });
    if (!audioFile) {
      throw new RecordError({ type: RecordErrorType.FAIL_AUDIO_FILE });
    }
    return { audioFile, blobSize: blob.size };
  }),
  detectSilence: fromCallback(({ sendBack, input }) => {
    const { analyser } = input as {
      analyser: AnalyserNode;
    };
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const onSilence = () => sendBack({ type: 'STOP' });
    const cleanup = detectSilence(analyser, dataArray, onSilence);

    return () => {
      cleanup();
    };
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
    audioFile: null,
    audioBlobSize: null,
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
            input: ({ context }) => {
              if (!context.analyserNode || !context.audioContext) {
                throw new AppError({ message: 'Context not ready for getting permission', data: null });
              }
              return { analyserNode: context.analyserNode, audioContext: context.audioContext };
            },
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
              const { audioContext, stream } = context;
              if (!audioContext || !stream) {
                throw new AppError({ message: 'Context not ready for recording', data: null });
              }

              const recorder = new Recorder(audioContext);

              try {
                recorder.init(stream);
              } catch (error: unknown) {
                throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
              }

              try {
                recorder.start();
              } catch (error: unknown) {
                throw new AppError({ message: '녹음 시작하는데 실패했습니다.', data: error });
              }

              return recorder;
            },
          }),
          invoke: {
            src: 'detectSilence',
            input: ({ context }) => {
              if (!context.analyserNode) {
                throw new AppError({ message: 'Context not ready for silence detection', data: null });
              }

              return { analyser: context.analyserNode };
            },
          },
          exit: [
            ({ context }) => {
              context.stream?.getTracks().forEach(track => track.stop());
            },
          ],
          on: { STOP: 'processing' },
        },
        processing: {
          invoke: {
            id: 'stopAndGetBlob',
            src: 'stopAndGetBlob',
            input: ({ context }) => {
              if (!context.recorder) {
                throw new AppError({ message: 'Context not ready for processing', data: null });
              }
              return { recorder: context.recorder };
            },
            onDone: {
              target: 'uploading',
              actions: assign({
                audioFile: ({ event }) => event.output.audioFile,
                audioBlobSize: ({ event }) => event.output.blobSize,
              }),
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
          exit: [assign({ audioFile: () => null, audioBlobSize: () => null }), 'cleanupRecorderStream'],
        },
      },
    },
    failure: { type: 'final' },
  },
});

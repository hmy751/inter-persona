interface RecorderMockType extends jest.Mock {
  mockRecorderInit: jest.Mock;
  mockRecorderStart: jest.Mock;
  mockRecorderStop: jest.Mock;
}

const mockRecorderInit = jest.fn().mockResolvedValue(undefined);
const mockRecorderStart = jest.fn().mockResolvedValue(undefined);
const mockRecorderStop = jest.fn().mockResolvedValue({
  blob: new Blob(['mock audio data'], { type: 'audio/wav' }),
});

function RecorderMockConstructor(this: any, audioContext: AudioContext) {
  this.init = mockRecorderInit;
  this.start = mockRecorderStart;
  this.stop = mockRecorderStop;
}

const RecorderMock = jest.fn(RecorderMockConstructor) as unknown as RecorderMockType;

RecorderMock.mockRecorderInit = mockRecorderInit;
RecorderMock.mockRecorderStart = mockRecorderStart;
RecorderMock.mockRecorderStop = mockRecorderStop;

jest.mock('recorder-js', () => RecorderMock);

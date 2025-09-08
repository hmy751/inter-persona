/**
 * window.navigator
 */
const mockStopTrack = jest.fn();
export const mockStream = {
  getTracks: jest.fn(() => [{ stop: mockStopTrack }]),
};
export const mockGetUserMedia = jest.fn().mockResolvedValue(mockStream);

function ensureMediaDevices() {
  if (!window.navigator.mediaDevices) {
    Object.defineProperty(window.navigator, 'mediaDevices', {
      writable: true,
      configurable: true,
      enumerable: true,
      value: {},
    });
  }

  Object.defineProperty(window.navigator.mediaDevices, 'getUserMedia', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: mockGetUserMedia,
  });
}

ensureMediaDevices();

export function resetMediaDevicesMock() {
  mockStopTrack.mockReset();
  mockStream.getTracks.mockReset();
  mockStream.getTracks.mockImplementation(() => [{ stop: mockStopTrack }]);
  mockGetUserMedia.mockReset();
  mockGetUserMedia.mockResolvedValue(mockStream);
  ensureMediaDevices();
}

/**
 * window.AudioContext
 */
const mockGetByteTimeDomainData = jest.fn();
const mockAnalyserNode = {
  fftSize: 2048,
  getByteTimeDomainData: mockGetByteTimeDomainData,
};
const mockCreateAnalyser = jest.fn().mockImplementation(() => mockAnalyserNode);
const mockSource = { connect: jest.fn() };
const mockCreateMediaStreamSource = jest.fn().mockImplementation(() => mockSource);

function MockAudioContextConstructor(this: { createAnalyser: jest.Mock; createMediaStreamSource: jest.Mock }) {
  this.createAnalyser = mockCreateAnalyser;
  this.createMediaStreamSource = mockCreateMediaStreamSource;
}

Object.defineProperty(window, 'AudioContext', {
  value: jest.fn(MockAudioContextConstructor),
});

/**
 * File 관련 mock
 */
const mockFile = jest.fn().mockImplementation(() => ({
  type: 'audio/wav',
  name: 'recording.wav',
}));

Object.defineProperty(window, 'File', {
  value: mockFile,
});

/**
 * FormData 관련 mock
 */
export const mockFormData = {
  append: jest.fn(),
};
const MockFormData = jest.fn().mockImplementation(() => mockFormData);
Object.defineProperty(window, 'FormData', {
  value: MockFormData,
});

/**
 * GTM window.dataLayer 목킹
 */
Object.defineProperty(window, 'dataLayer', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: [],
});


/**
 * window.navigator
 */
export const mockStream = {};
const mockGetUserMedia = jest.fn().mockResolvedValue(mockStream);

if (!window.navigator.mediaDevices) {
  Object.defineProperty(window.navigator, "mediaDevices", {
    writable: true,
    configurable: true,
    enumerable: true,
    value: {
      getUserMedia: mockGetUserMedia,
    },
  });
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
const mockCreateMediaStreamSource = jest
  .fn()
  .mockImplementation(() => mockSource);

function MockAudioContextConstructor(this: any) {
  this.createAnalyser = mockCreateAnalyser;
  this.createMediaStreamSource = mockCreateMediaStreamSource;
}

Object.defineProperty(window, "AudioContext", {
  value: jest.fn(MockAudioContextConstructor),
});

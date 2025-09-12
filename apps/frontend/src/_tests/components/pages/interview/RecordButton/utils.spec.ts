import { calculateRMS, detectSilence } from '@/_components/pages/interview/RecordButton/utils';

const getByteTimeDomainDataMock = jest.fn();
const mockAnalyserNode = {
  getByteTimeDomainData: getByteTimeDomainDataMock,
} as unknown as AnalyserNode;
const mockDataArray = new Uint8Array(1024);

describe('RecordButton utils', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    getByteTimeDomainDataMock.mockClear();
    jest.clearAllTimers();
  });

  describe('calculateRMS', () => {
    it('완벽히 조용한 오디오 데이터에 대해 0을 반환해야 한다', () => {
      getByteTimeDomainDataMock.mockImplementation(dataArray => {
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = 128;
        }
      });
      const rms = calculateRMS(mockAnalyserNode, mockDataArray);
      expect(rms).toBe(0);
    });

    it('최대 볼륨의 오디오 데이터에 대해 약 1.0에 가까운 값을 반환해야 한다', () => {
      getByteTimeDomainDataMock.mockImplementation(dataArray => {
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = 255;
        }
      });
      const rms = calculateRMS(mockAnalyserNode, mockDataArray);
      expect(rms).toBeCloseTo(0.99, 2);
    });
  });

  describe('detectSilence', () => {
    it('일정 시간 동안 조용할 경우 onSilence 콜백을 호출해야 한다', () => {
      const mockOnSilence = jest.fn();
      getByteTimeDomainDataMock.mockImplementation(dataArray => {
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = 128;
        }
      });

      detectSilence(mockAnalyserNode, mockDataArray, mockOnSilence, { timeout: 1000 });

      jest.advanceTimersByTime(1100);

      expect(mockOnSilence).toHaveBeenCalled();
    });

    it('소리가 감지되면 타임아웃을 리셋해야 한다', () => {
      const mockOnSilence = jest.fn();
      getByteTimeDomainDataMock.mockImplementation(dataArray => {
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = 128;
        }
      });

      detectSilence(mockAnalyserNode, mockDataArray, mockOnSilence, { timeout: 1000 });

      jest.advanceTimersByTime(900);

      getByteTimeDomainDataMock.mockImplementation(dataArray => {
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = 255;
        }
      });

      jest.advanceTimersByTime(600);

      expect(mockOnSilence).not.toHaveBeenCalled();
    });

    it('cleanup 함수가 cancelAnimationFrame을 호출해야 한다', () => {
      const mockOnSilence = jest.fn();
      const spyCancelAnimation = jest.spyOn(global, 'cancelAnimationFrame');
      const cleanup = detectSilence(mockAnalyserNode, mockDataArray, mockOnSilence, { timeout: 1000 });

      cleanup();

      expect(spyCancelAnimation).toHaveBeenCalled();
    });
  });
});

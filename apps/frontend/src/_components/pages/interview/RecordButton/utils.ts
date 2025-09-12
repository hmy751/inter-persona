// 현재 오디오 파형 데이터의 RMS(Root Mean Square, 제곱평균제곱근)을 계산한다.
// RMS는 오디오 신호의 평균적인 에너지나 볼륨을 나타내는 척도이다.
export const calculateRMS = (analyser: AnalyserNode, dataArray: Uint8Array): number => {
  // 현재 시간의 오디오 파형 데이터를 dateArray에 채워 넣는다.
  analyser.getByteTimeDomainData(dataArray);

  let sumSquares = 0.0;

  for (let i = 0; i < dataArray.length; i++) {
    // -1.0에서 1.0 사이로 정규화한다.
    const normalizedSample = (dataArray[i] ?? 128) / 128.0 - 1.0;
    sumSquares += normalizedSample * normalizedSample;
  }

  return Math.sqrt(sumSquares / dataArray.length);
};

type SilenceDetectorOptions = {
  silenceThreshold?: number;
  timeout?: number;
};

export const detectSilence = (
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  onSilence: () => void,
  options: SilenceDetectorOptions = {}
) => {
  const { silenceThreshold = 0.01, timeout = 1000 } = options;

  let silenceStart = performance.now();
  let animationFrameId: number;

  const check = () => {
    const rms = calculateRMS(analyser, dataArray);

    // 소리가 작을 때 정적으로 간주
    if (rms < silenceThreshold) {
      const silentDuration = performance.now() - silenceStart;

      // 정적이 설정된 시간보다 길어지면 onSilence콜백을 실행한다.
      if (silentDuration > timeout) {
        onSilence();
        cancelAnimationFrame(animationFrameId);
        return;
      }
    } else {
      // 소리가 감지되면 정적 시작 시간을 현재로 초기화한다.
      silenceStart = performance.now();
    }

    animationFrameId = requestAnimationFrame(check);
  };

  check();

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
};

export const checkFileWave = (audioFile: File) => {
  const reader = new FileReader();

  reader.onloadend = (event: ProgressEvent<FileReader>) => {
    if (!event.target) {
      return;
    }
    const arrayBuffer = event.target.result;
    const uint8Array = new Uint8Array(arrayBuffer as ArrayBufferLike);

    // 파일의 첫 12바이트를 읽어 포맷 확인 ("RIFF" + "WAVE")
    const header = String.fromCharCode(...uint8Array.slice(0, 4)); // "RIFF" 확인
    const waveFormat = String.fromCharCode(...uint8Array.slice(8, 12)); // "WAVE" 확인

    if (header === 'RIFF' && waveFormat === 'WAVE') {
      // console.log('This is a valid WAV file.');
    } else {
      // console.log('This is not a WAV file.');
    }
  };

  // 파일의 첫 12바이트를 읽기 위해 slice 사용
  reader.readAsArrayBuffer(audioFile.slice(0, 12));
};

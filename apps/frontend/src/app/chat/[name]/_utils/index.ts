export const checkFileWave = (audioFile: File) => {
  const reader = new FileReader();

  reader.onloadend = (event: ProgressEvent<FileReader>) => {
    if (!event.target) return;
    const arrayBuffer = event.target.result;
    const uint8Array = new Uint8Array(arrayBuffer as ArrayBufferLike);

    // 파일의 첫 12바이트를 읽어 포맷 확인 ("RIFF" + "WAVE")
    const header = String.fromCharCode(...uint8Array.slice(0, 4)); // "RIFF" 확인
    const waveFormat = String.fromCharCode(...uint8Array.slice(8, 12)); // "WAVE" 확인

    if (header === "RIFF" && waveFormat === "WAVE") {
      console.log("This is a valid WAV file.");
    } else {
      console.log("This is not a WAV file.");
    }
  };

  // 파일의 첫 12바이트를 읽기 위해 slice 사용
  reader.readAsArrayBuffer(audioFile.slice(0, 12));
};

export const detectSilence = (
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  setIsRecording: React.Dispatch<
    React.SetStateAction<"finished" | "recording" | null>
  >,
  silenceThreshold = 0.01,
  timeout = 1000
) => {
  let silenceStart = performance.now();

  function checkSilence() {
    analyser.getByteTimeDomainData(dataArray);

    // RMS 계산
    let rms = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] as number) / 128 - 1;
      rms += normalized * normalized;
    }
    rms = Math.sqrt(rms / dataArray.length);

    if (rms < silenceThreshold) {
      // 음성 중지 감지 (특정 시간 동안 rms가 임계값 이하인 경우)
      if (performance.now() - silenceStart > timeout) {
        setIsRecording("finished");
        return;
      }
    } else {
      // 음성이 감지되면 타이머를 초기화
      silenceStart = performance.now();
    }

    requestAnimationFrame(checkSilence);
  }

  checkSilence();
};

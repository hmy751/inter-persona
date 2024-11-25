import { useRef, useState, useEffect } from "react";
import { detectSilence } from "../_utils";

import Recorder from "recorder-js";
import { useDispatch, useSelector } from "react-redux";
import { SEND_RECORD } from "@/store/redux/features/chat/slice";
import { selectLastBotChatStatus } from "@/store/redux/features/chat/selector";

import Avatar from "@repo/ui/Avatar";

export enum RecordingStatus {
  loading = "loading",
  success = "success",
  idle = "idle",
}

export default function RecordButton() {
  const recorderRef = useRef<Recorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>(
    RecordingStatus.idle
  );
  const dispatch = useDispatch();

  const handleRecord = async () => {
    if (recordingStatus === RecordingStatus.loading) return;

    const { mediaDevices } = navigator;
    const stream = await mediaDevices.getUserMedia({ audio: true });

    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    const dataArray = new Uint8Array(analyserNode.fftSize);

    const recorder = new Recorder(audioContext);
    recorderRef.current = recorder;

    await recorderRef.current.init(stream);

    recorderRef.current
      .start()
      .then(() => setRecordingStatus(RecordingStatus.loading));

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyserNode);

    detectSilence(analyserNode, dataArray, setRecordingStatus);
  };

  useEffect(() => {
    if (recorderRef.current === null) return;
    if (
      recordingStatus === RecordingStatus.idle ||
      recordingStatus === RecordingStatus.loading
    )
      return;

    if (recordingStatus === RecordingStatus.success) {
      finishRecord();
    }

    return () => {
      setRecordingStatus(RecordingStatus.idle);
    };
  }, [recordingStatus]);

  const finishRecord = async () => {
    if (recorderRef.current === null) return;

    const { blob } = await recorderRef.current.stop();
    const audioFile = new File([blob], "recording.wav", { type: "audio/wav" });

    if (!audioFile) {
      console.error("No audio file to send.");
      return;
    }

    const params = {
      language: "ko-KR",
      completion: "sync",
      wordAlignment: true,
      fullText: true,
    };

    const formData = new FormData();
    formData.append("media", audioFile);
    formData.append("params", JSON.stringify(params));

    dispatch({ type: SEND_RECORD, payload: { formData } });
  };

  const recordingState = () => {
    if (
      recordingStatus === RecordingStatus.idle ||
      recordingStatus === RecordingStatus.success
    ) {
      return "/assets/images/record.png";
    }

    if (recordingStatus === RecordingStatus.loading) {
      return "/assets/images/recording.png";
    }

    return "/assets/images/record.png";
  };

  return (
    <>
      <Avatar
        width={"40px"}
        height={"40px"}
        src={recordingState()}
        onClick={handleRecord}
        style={{
          cursor: "pointer",
        }}
      />
    </>
  );
}

import { useRef, useState, useEffect } from "react";
import { detectSilence } from "../_utils";

import Recorder from "recorder-js";
import { useDispatch, useSelector } from "react-redux";
import { SEND_RECORD } from "@/store/redux/features/chat/slice";
import { selectCurrentRecordingAnswer } from "@/store/redux/features/chat/selector";

import Avatar from "@repo/ui/Avatar";

export enum RecordingStatusType {
  loading = "loading",
  success = "success",
  idle = "idle",
}

export default function RecordButton() {
  const recorderRef = useRef<Recorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatusType>(
    RecordingStatusType.idle
  );
  const dispatch = useDispatch();
  const currentRecordingAnswer = useSelector(selectCurrentRecordingAnswer);

  const handleRecord = async () => {
    if (recordingStatus === RecordingStatusType.loading) return;

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
      .then(() => setRecordingStatus(RecordingStatusType.loading));

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyserNode);

    detectSilence(analyserNode, dataArray, setRecordingStatus);
  };

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
      recordingStatus === RecordingStatusType.idle ||
      recordingStatus === RecordingStatusType.success
    ) {
      return "/assets/images/record.png";
    }

    if (recordingStatus === RecordingStatusType.loading) {
      return "/assets/images/recording.png";
    }

    return "/assets/images/record.png";
  };

  useEffect(() => {
    if (recorderRef.current === null) return;
    if (
      recordingStatus === RecordingStatusType.idle ||
      recordingStatus === RecordingStatusType.loading
    )
      return;

    if (recordingStatus === RecordingStatusType.success) {
      finishRecord();
    }

    return () => {
      setRecordingStatus(RecordingStatusType.idle);
    };
  }, [recordingStatus]);

  useEffect(() => {
    if (!currentRecordingAnswer) return;

    if (
      currentRecordingAnswer?.status === "success" ||
      currentRecordingAnswer?.status === "fail"
    ) {
      setRecordingStatus(RecordingStatusType.idle);
    }

    return () => {
      setRecordingStatus(RecordingStatusType.idle);
    };
  }, [currentRecordingAnswer]);

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

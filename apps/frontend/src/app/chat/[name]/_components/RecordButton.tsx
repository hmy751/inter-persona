import { useRef, useState, useEffect } from "react";
import { detectSilence } from "../_utils";

import Recorder from "recorder-js";
import { useDispatch, useSelector } from "react-redux";
import { SEND_RECORD } from "@/store/redux/features/chat/slice";
import { selectLastBotChatStatus } from "@/store/redux/features/chat/selector";

import Avatar from "@repo/ui/Avatar";

export default function RecordButton() {
  const recorderRef = useRef<Recorder | null>(null);
  const [isRecording, setIsRecording] = useState<
    "recording" | "finished" | null
  >(null);
  const dispatch = useDispatch();

  const handleRecord = async () => {
    const { mediaDevices } = navigator;
    const stream = await mediaDevices.getUserMedia({ audio: true });

    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    const dataArray = new Uint8Array(analyserNode.fftSize);

    const recorder = new Recorder(audioContext);
    recorderRef.current = recorder;

    await recorderRef.current.init(stream);

    recorderRef.current.start().then(() => setIsRecording("recording"));

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyserNode);

    detectSilence(analyserNode, dataArray, setIsRecording);
  };

  useEffect(() => {
    if (recorderRef.current === null) return;
    if (isRecording === null || isRecording === "recording") return;

    if (isRecording === "finished") {
      finishRecord();
    }

    return () => {
      setIsRecording(null);
    };
  }, [isRecording]);

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
    if (isRecording === null || isRecording === "finished") {
      return "/assets/images/record.png";
    }

    if (isRecording === "recording") {
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

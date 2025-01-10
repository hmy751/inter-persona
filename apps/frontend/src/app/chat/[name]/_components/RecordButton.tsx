"use client";

import { useRef, useState, useEffect } from "react";
import { detectSilence } from "../_utils";
import Image from "next/image";
import styles from "./RecordButton.module.css";
import Recorder from "recorder-js";
import { useDispatch, useSelector } from "react-redux";
import { SEND_RECORD } from "@/store/redux/features/chat/slice";
import { ChatContentStatusType } from "@/store/redux/type";
import { selectCurrentRecordingAnswer } from "@/store/redux/features/chat/selector";
import clsx from "clsx";

export enum RecordingStatusType {
  loading = "loading",
  success = "success",
  idle = "idle",
  fail = "fail",
}

const RECORD_BUTTON_ICON_SRC = {
  [RecordingStatusType.idle]: "/assets/images/record-button.svg",
  [RecordingStatusType.success]: "/assets/images/record-button.svg",
  [RecordingStatusType.loading]: "/assets/images/recording-animation.svg",
  [RecordingStatusType.fail]: "/assets/images/record-button-disabled.svg",
};

export default function RecordButton() {
  const recorderRef = useRef<Recorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatusType>(
    RecordingStatusType.idle
  );
  const dispatch = useDispatch();
  const currentRecordingAnswer = useSelector(selectCurrentRecordingAnswer);

  const handleRecord = async () => {
    if (
      recordingStatus === RecordingStatusType.loading ||
      recordingStatus === RecordingStatusType.fail
    )
      return;

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
      currentRecordingAnswer?.status === ChatContentStatusType.success ||
      currentRecordingAnswer?.status === ChatContentStatusType.idle
    ) {
      setRecordingStatus(RecordingStatusType.idle);
    }

    if (currentRecordingAnswer?.status === ChatContentStatusType.fail) {
      setRecordingStatus(RecordingStatusType.fail);
    }

    return () => {
      setRecordingStatus(RecordingStatusType.idle);
    };
  }, [currentRecordingAnswer]);

  return (
    <Image
      width={60}
      height={60}
      src={RECORD_BUTTON_ICON_SRC[recordingStatus]}
      alt="record-button"
      sizes="60px"
      onClick={handleRecord}
      className={clsx([
        styles.button,
        recordingStatus === RecordingStatusType.fail && styles.fail,
        recordingStatus === RecordingStatusType.loading && styles.loading,
      ])}
    />
  );
}

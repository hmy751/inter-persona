"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
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
  idle = "idle",
  recording = "recording",
  finished = "finished",
}

export const IDLE_ICON_SRC = "/assets/images/record-button.svg";
export const RECORDING_ICON_SRC = "/assets/images/recording-animation.svg";
export const DISABLED_ICON_SRC = "/assets/images/record-button-disabled.svg";

export default function RecordButton() {
  const recorderRef = useRef<Recorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatusType>(
    RecordingStatusType.idle
  );
  const [buttonIconSrc, setButtonIconSrc] = useState<string>(
    "/assets/images/record-button.svg"
  );

  const dispatch = useDispatch();
  const currentRecordingAnswer = useSelector(selectCurrentRecordingAnswer);
  const isDisabledRecord =
    currentRecordingAnswer?.status === ChatContentStatusType.fail;

  const handleRecord = async () => {
    const isRecordingOrDisabled =
      recordingStatus === RecordingStatusType.recording || isDisabledRecord;

    if (isRecordingOrDisabled) return;

    const { mediaDevices } = navigator;
    const stream = await mediaDevices.getUserMedia({ audio: true });

    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    const dataArray = new Uint8Array(analyserNode.fftSize);

    const recorder = new Recorder(audioContext);
    recorderRef.current = recorder;

    await recorderRef.current.init(stream);

    recorderRef.current.start().then(() => {
      setRecordingStatus(RecordingStatusType.recording);
    });

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
    (function checkFinishedRecording() {
      if (recorderRef.current === null) return;

      const isIdleRecordingOrDisabled =
        recordingStatus === RecordingStatusType.idle || isDisabledRecord;

      if (isIdleRecordingOrDisabled) return;

      const isFinishedRecording =
        recordingStatus === RecordingStatusType.finished;

      if (isFinishedRecording) {
        finishRecord();
      }
    })();
  }, [recordingStatus]);

  useEffect(() => {
    (function checkAvailableRecordingIdle() {
      if (!currentRecordingAnswer) return;

      const isSuccessOrIdleRecording =
        currentRecordingAnswer?.status === ChatContentStatusType.success ||
        currentRecordingAnswer?.status === ChatContentStatusType.idle;

      if (isSuccessOrIdleRecording) {
        setRecordingStatus(RecordingStatusType.idle);
      }
    })();
  }, [currentRecordingAnswer]);

  useEffect(() => {
    const isRecording = recordingStatus === RecordingStatusType.recording;

    if (isDisabledRecord) {
      setButtonIconSrc(DISABLED_ICON_SRC);
      return;
    }

    if (isRecording) {
      setButtonIconSrc(RECORDING_ICON_SRC);
      return;
    }

    setButtonIconSrc(IDLE_ICON_SRC);

    return () => {
      setButtonIconSrc(IDLE_ICON_SRC);
    };
  }, [isDisabledRecord, recordingStatus]);

  return (
    <Image
      data-testid="record-button"
      width={60}
      height={60}
      src={buttonIconSrc}
      alt="record-button"
      sizes="60px"
      onClick={handleRecord}
      className={clsx([
        styles.button,
        isDisabledRecord && styles.disabled,
        recordingStatus === RecordingStatusType.recording && styles.recording,
      ])}
    />
  );
}

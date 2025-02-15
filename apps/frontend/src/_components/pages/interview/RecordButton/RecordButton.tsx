"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Button from "@repo/ui/Button";
import { detectSilence } from "./utils";
import Image from "next/image";
import styles from "./RecordButton.module.css";
import Recorder from "recorder-js";
import { useDispatch, useSelector } from "react-redux";
import { SEND_RECORD } from "@/_store/redux/features/chat/slice";
import { ChatContentStatusType } from "@/_store/redux/type";
import {
  selectChatLimit,
  selectCurrentRecordingAnswer,
} from "@/_store/redux/features/chat/selector";
import clsx from "clsx";
import {
  IDLE_ICON_SRC,
  RECORDING_ICON_SRC,
  DISABLED_ICON_SRC,
} from "./constants";
import { RecordError } from "./_error";
import { createRecordError, RecordErrorType } from "./_error";
import useAlertDialogStore from "@repo/store/useAlertDialogStore";
import useConfirmDialogStore from "@repo/store/useConfirmDialogStore";
import useToastStore from "@repo/store/useToastStore";
import { useCreateResult } from "@/_data/result";

export enum RecordingStatusType {
  idle = "idle",
  recording = "recording",
  finished = "finished",
}

export default function RecordButton() {
  const recorderRef = useRef<Recorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatusType>(
    RecordingStatusType.idle
  );
  const [buttonIconSrc, setButtonIconSrc] = useState<string>(
    "/assets/images/record-button.svg"
  );
  const chatLimit = useSelector(selectChatLimit);

  const dispatch = useDispatch();
  const currentRecordingAnswer = useSelector(selectCurrentRecordingAnswer);
  const isDisabledRecord =
    currentRecordingAnswer?.status === ChatContentStatusType.fail;
  const cleanupRef = useRef<() => void>(() => {});
  const { setAlert } = useAlertDialogStore();
  const { setConfirm } = useConfirmDialogStore();
  const { addToast } = useToastStore();
  const { mutate, isPending } = useCreateResult();

  const handleRecord = async () => {
    try {
      cleanupRef.current?.();

      const isRecordingOrDisabled =
        recordingStatus === RecordingStatusType.recording || isDisabledRecord;

      if (isRecordingOrDisabled) return;

      // 1. 오디오 스트림 가져오기
      const { mediaDevices } = navigator;
      if (!mediaDevices?.getUserMedia) {
        throw createRecordError(RecordErrorType.API_NOT_SUPPORTED);
      }

      let stream: MediaStream;
      try {
        stream = await mediaDevices.getUserMedia({ audio: true });
      } catch (error: any) {
        switch (error.name) {
          case "NotAllowedError":
            throw createRecordError(
              error.message.includes("denied")
                ? RecordErrorType.PERMISSION_DENIED
                : RecordErrorType.PERMISSION_DISMISSED,
              error
            );
          case "NotFoundError":
            throw createRecordError(RecordErrorType.DEVICE_NOT_FOUND, error);
          case "NotReadableError":
          case "TrackStartError":
            throw createRecordError(RecordErrorType.DEVICE_NOT_READABLE, error);
          case "OverconstrainedError":
            throw createRecordError(RecordErrorType.DEVICE_NOT_FOUND, error);
          default:
            throw createRecordError(RecordErrorType.UNKNOWN_ERROR, error);
        }
      }

      // 2. 음량 감지를 위한 analyser 생성
      let audioContext: AudioContext;
      try {
        audioContext = new window.AudioContext();
      } catch (error: any) {
        throw createRecordError(RecordErrorType.CONTEXT_NOT_ALLOWED, error);
      }

      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      const dataArray = new Uint8Array(analyserNode.fftSize);

      // 3. stream을 source로 변환하고 analyser에 연결
      let source: MediaStreamAudioSourceNode;
      try {
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyserNode);
      } catch (error: any) {
        throw createRecordError(RecordErrorType.DEVICE_NOT_READABLE, error);
      }

      // 4. recorder 초기화
      const recorder = new Recorder(audioContext);
      recorderRef.current = recorder;

      // 5. recorder 초기화
      try {
        await recorderRef.current.init(stream);
      } catch (error: any) {
        throw createRecordError(RecordErrorType.DEVICE_NOT_READABLE, error);
      }

      // 6. 녹음 시작
      try {
        await recorderRef.current.start();
        setRecordingStatus(RecordingStatusType.recording);
      } catch (error: any) {
        throw createRecordError(RecordErrorType.UNKNOWN_ERROR, error);
      }

      cleanupRef.current = detectSilence(
        analyserNode,
        dataArray,
        setRecordingStatus
      );
    } catch (error) {
      if (error instanceof RecordError) {
        const { manage, title, message } = error.detail;
        switch (manage) {
          case "alertDialog":
            setAlert(title, message);
            break;
          case "confirmDialog":
            setConfirm(title, message, () => {});
            break;
          case "toast":
            addToast({
              title,
              description: message,
              duration: 3000,
            });
            break;
        }

        return;
      }

      addToast({
        title: "알 수 없는 오류",
        description: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
        duration: 3000,
      });
    }
  };

  const finishRecord = async () => {
    try {
      if (recorderRef.current === null) {
        throw createRecordError(RecordErrorType.UNKNOWN_ERROR);
      }

      const { blob } = await recorderRef.current.stop();

      // 파일 크기 체크 (예: 50MB 제한)
      if (blob.size > 50 * 1024 * 1024) {
        throw createRecordError(RecordErrorType.FILE_TOO_LARGE);
      }

      const audioFile = new File([blob], "recording.wav", {
        type: "audio/wav",
      });

      if (!audioFile) {
        throw createRecordError(RecordErrorType.UNKNOWN_ERROR);
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
    } catch (error) {
      if (error instanceof RecordError) {
        const { manage, title, message } = error.detail;
        switch (manage) {
          case "alertDialog":
            setAlert(title, message);
            break;
          case "confirmDialog":
            setConfirm(title, message, () => {});
            break;
          case "toast":
            addToast({
              title,
              description: message,
              duration: 3000,
            });
            break;
        }

        return;
      }

      addToast({
        title: "알 수 없는 오류",
        description: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (recordingStatus === RecordingStatusType.finished) {
      cleanupRef.current();
    }
  }, [recordingStatus]);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

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

  const handleClickResultButton = async () => {
    if (!chatLimit) {
      addToast({
        title: "인터뷰 아직 완료되지 않았습니다.",
        description: "인터뷰가 완료되면 결과를 확인할 수 있습니다.",
        duration: 3000,
      });
      return;
    }

    mutate();
  };

  return (
    <>
      {chatLimit ? (
        <Button
          onClick={handleClickResultButton}
          variant="primary"
          size="lg"
          isLoading={isPending}
        >
          결과 보기
        </Button>
      ) : (
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
            recordingStatus === RecordingStatusType.recording &&
              styles.recording,
          ])}
        />
      )}
    </>
  );
}

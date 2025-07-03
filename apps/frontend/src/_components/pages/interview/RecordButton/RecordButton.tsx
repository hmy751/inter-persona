'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Button from '@repo/ui/Button';
import { detectSilence } from './utils';
import Image from 'next/image';
import styles from './RecordButton.module.css';
import Recorder from 'recorder-js';
import { useDispatch, useSelector } from 'react-redux';
import { SEND_RECORD } from '@/_store/redux/features/chat/slice';
import { ChatContentStatusType } from '@/_store/redux/type';
import { selectCurrentRecordingAnswer, selectInterviewStatus } from '@/_store/redux/features/chat/selector';
import clsx from 'clsx';
import { IDLE_ICON_SRC, RECORDING_ICON_SRC, DISABLED_ICON_SRC } from './constants';
import { RecordError, RecordErrorType } from '@/_libs/error/errors/RecordError';
import { AppError } from '@/_libs/error/errors';
import { errorService } from '@/_libs/error/service';

import useToastStore from '@repo/store/useToastStore';
import { useCreateResult } from '@/_data/result';
import { useParams } from 'next/navigation';
import { useGetInterview } from '@/_data/interview';
import {
  GTMRecordingStarted,
  GTMAnswerSubmittedFailed,
  GTMAnswerSubmittedSuccess,
  GTMRecordingCompleted,
} from '@/_libs/utils/analysis/interview';
import { getSessionId } from '@/_libs/utils/session';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';
export enum RecordingStatusType {
  idle = 'idle',
  recording = 'recording',
  finished = 'finished',
}

export default function RecordButton() {
  const interviewId = useParams().interviewId;
  const recorderRef = useRef<Recorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatusType>(RecordingStatusType.idle);
  const [buttonIconSrc, setButtonIconSrc] = useState<string>('/assets/images/record-button.svg');
  const interviewStatus = useSelector(selectInterviewStatus);
  const funnelId = useFunnelIdStore(state => state.funnelId);
  const recordingStartTime = useRef<string | null>(null);

  const dispatch = useDispatch();
  const currentRecordingAnswer = useSelector(selectCurrentRecordingAnswer);
  const isDisabledRecord = currentRecordingAnswer?.status === ChatContentStatusType.fail;
  const cleanupRef = useRef<() => void>(() => {});
  const { addToast } = useToastStore();
  const { mutate, isPending } = useCreateResult();
  const { data, isLoading: interviewStatusLoading } = useGetInterview(Number(interviewId));

  const isCompletedInterview = data?.interview.status === 'completed' || interviewStatus === 'completed';
  const contentsLength = data?.interview.contents?.length;

  const handleRecord = useCallback(async () => {
    const recordingStartTimeDate = new Date(recordingStartTime.current as string);

    try {
      cleanupRef.current?.();

      const isRecordingOrDisabled = recordingStatus === RecordingStatusType.recording || isDisabledRecord;

      if (isRecordingOrDisabled) {
        return;
      }

      // 1. 오디오 스트림 가져오기
      const { mediaDevices } = navigator;

      if (!mediaDevices?.getUserMedia) {
        throw new RecordError({ type: RecordErrorType.API_NOT_SUPPORTED });
      }

      let stream: MediaStream;

      try {
        stream = await mediaDevices.getUserMedia({ audio: true });
      } catch (error: unknown) {
        if (error instanceof Error) {
          switch (error.name) {
            case 'NotAllowedError':
              throw new RecordError({ type: RecordErrorType.PERMISSION_DENIED });
            case 'NotFoundError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_FOUND });
            case 'NotReadableError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
            case 'TrackStartError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
            case 'OverconstrainedError':
              throw new RecordError({ type: RecordErrorType.DEVICE_NOT_FOUND });
            default:
              throw error;
          }
        }

        throw error;
      }

      // 2. 음량 감지를 위한 analyser 생성
      let audioContext: AudioContext;

      try {
        audioContext = new window.AudioContext();
      } catch (error: unknown) {
        throw new RecordError({ type: RecordErrorType.CONTEXT_NOT_ALLOWED });
      }

      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      const dataArray = new Uint8Array(analyserNode.fftSize);

      // 3. stream을 source로 변환하고 analyser에 연결
      let source: MediaStreamAudioSourceNode;

      try {
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyserNode);
      } catch (error: unknown) {
        throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
      }

      // 4. recorder 초기화
      const recorder = new Recorder(audioContext);
      recorderRef.current = recorder;

      // 5. recorder 초기화
      try {
        await recorderRef.current.init(stream);
      } catch (error: unknown) {
        throw new RecordError({ type: RecordErrorType.DEVICE_NOT_READABLE });
      }

      // 6. 녹음 시작
      try {
        await recorderRef.current.start();
        setRecordingStatus(RecordingStatusType.recording);

        recordingStartTime.current = new Date().toISOString();

        GTMRecordingStarted({
          interview_id: interviewId as string,
          question_id: (contentsLength || 0 + 1).toString() || '',
          start_time: new Date().toISOString(),
          session_id: getSessionId() || '',
          funnel_id: funnelId || '',
        });
      } catch (error: unknown) {
        throw new AppError({ message: '녹음 시작하는데 실패했습니다.', data: error });
      }

      cleanupRef.current = detectSilence(analyserNode, dataArray, setRecordingStatus);
    } catch (error) {
      GTMAnswerSubmittedFailed({
        interview_id: interviewId as string,
        question_id: (contentsLength || 0 + 1).toString() || '',
        duration: (new Date().getTime() - recordingStartTimeDate.getTime()) / 1000,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
        message: error instanceof AppError ? error.message : '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });

      errorService.handle(error, {
        type: 'toast',
        title: '녹음 에러',
        description: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
  }, [addToast, funnelId, interviewId, contentsLength, isDisabledRecord, recordingStatus]);

  const finishRecord = useCallback(async () => {
    const recordingStartTimeDate = new Date(recordingStartTime.current as string);

    try {
      if (recorderRef.current === null) {
        throw new RecordError({ type: RecordErrorType.RECORDER_NOT_FOUND });
      }

      const { blob } = await recorderRef.current.stop();

      GTMRecordingCompleted({
        interview_id: interviewId as string,
        question_id: (contentsLength || 0 + 1).toString() || '',
        duration: (new Date().getTime() - recordingStartTimeDate.getTime()) / 1000,
        file_size: blob.size,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
      });

      // 파일 크기 체크 (예: 50MB 제한)
      if (blob.size > 50 * 1024 * 1024) {
        throw new RecordError({ type: RecordErrorType.FILE_TOO_LARGE });
      }

      const audioFile = new File([blob], 'recording.wav', {
        type: 'audio/wav',
      });

      if (!audioFile) {
        throw new RecordError({ type: RecordErrorType.FAIL_AUDIO_FILE });
      }

      const params = {
        language: 'ko-KR',
        completion: 'sync',
        wordAlignment: true,
        fullText: true,
      };

      const formData = new FormData();
      formData.append('media', audioFile);
      formData.append('params', JSON.stringify(params));

      dispatch({ type: SEND_RECORD, payload: { formData } });

      GTMAnswerSubmittedSuccess({
        interview_id: interviewId as string,
        question_id: (contentsLength || 0 + 1).toString() || '',
        duration: (new Date().getTime() - recordingStartTimeDate.getTime()) / 1000,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
      });
    } catch (error) {
      GTMAnswerSubmittedFailed({
        interview_id: interviewId as string,
        question_id: (contentsLength || 0 + 1).toString() || '',
        duration: (new Date().getTime() - recordingStartTimeDate.getTime()) / 1000,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
        message: error instanceof AppError ? error.message : '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });

      errorService.handle(error, {
        type: 'toast',
        title: '녹음 파일 오류',
        description: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
  }, [addToast, dispatch, funnelId, interviewId, contentsLength]);

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
      if (recorderRef.current === null) {
        return;
      }

      const isIdleRecordingOrDisabled = recordingStatus === RecordingStatusType.idle || isDisabledRecord;

      if (isIdleRecordingOrDisabled) {
        return;
      }

      const isFinishedRecording = recordingStatus === RecordingStatusType.finished;

      if (isFinishedRecording) {
        finishRecord();
      }
    })();
  }, [recordingStatus, isDisabledRecord, finishRecord]);

  useEffect(() => {
    (function checkAvailableRecordingIdle() {
      if (!currentRecordingAnswer) {
        return;
      }

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

  const handleClickResultButton = useCallback(async () => {
    if (!isCompletedInterview) {
      addToast({
        title: '인터뷰 아직 완료되지 않았습니다.',
        description: '인터뷰가 완료되면 결과를 확인할 수 있습니다.',
        duration: 3000,
      });
      return;
    }

    mutate(Number(interviewId));
  }, [addToast, isCompletedInterview, interviewId, mutate]);

  if (interviewStatusLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isCompletedInterview ? (
        <Button onClick={handleClickResultButton} variant="primary" size="lg" isLoading={isPending}>
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
            recordingStatus === RecordingStatusType.recording && styles.recording,
          ])}
        />
      )}
    </>
  );
}

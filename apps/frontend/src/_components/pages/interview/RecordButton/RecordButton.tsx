'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Button from '@repo/ui/Button';
import Image from 'next/image';
import styles from './RecordButton.module.css';
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
import { useMachine } from '@xstate/react';
import { recordMachine } from './recordMachine';

export default function RecordButton() {
  const interviewId = useParams().interviewId;
  const [snapshot, send] = useMachine(recordMachine);

  const [buttonIconSrc, setButtonIconSrc] = useState<string>('/assets/images/record-button.svg');
  const interviewStatus = useSelector(selectInterviewStatus);
  const funnelId = useFunnelIdStore(state => state.funnelId);
  const recordingStartTime = useRef<string | null>(null);

  const dispatch = useDispatch();
  const currentRecordingAnswer = useSelector(selectCurrentRecordingAnswer);
  const isDisabledRecord = currentRecordingAnswer?.status === ChatContentStatusType.fail;
  const { addToast } = useToastStore();
  const { mutate, isPending } = useCreateResult();
  const { data, isLoading: interviewStatusLoading } = useGetInterview(Number(interviewId));

  const isCompletedInterview = data?.interview.status === 'completed' || interviewStatus === 'completed';
  const contentsLength = data?.interview.contents?.length;

  useEffect(() => {
    send({ type: 'SETUP' });
  }, [send]);

  useEffect(() => {
    const { error } = snapshot.context;

    if (error) {
      const recordingStartTimeDate = recordingStartTime.current ? new Date(recordingStartTime.current) : new Date();

      GTMAnswerSubmittedFailed({
        interview_id: interviewId as string,
        question_id: ((contentsLength || 0) + 1).toString() || '',
        duration: recordingStartTime.current ? (new Date().getTime() - recordingStartTimeDate.getTime()) / 1000 : 0,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
        message: error instanceof AppError ? error.message : '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });

      errorService.handle(error, {
        type: 'toast',
        title: '녹음 에러',
        description: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });

      send({ type: 'CLEAR_ERROR' });
    }
  }, [snapshot.context.error, send, funnelId, interviewId, contentsLength]);

  useEffect(() => {
    if (snapshot.matches({ ready: 'recording' })) {
      const startTime = new Date().toISOString();
      recordingStartTime.current = startTime;

      GTMRecordingStarted({
        interview_id: interviewId as string,
        question_id: ((contentsLength || 0) + 1).toString() || '',
        start_time: startTime,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
      });
    }
  }, [snapshot, interviewId, contentsLength, funnelId]);

  useEffect(() => {
    const { audioBlob } = snapshot.context;

    if (snapshot.matches({ ready: 'uploading' }) && audioBlob) {
      const recordingStartTimeDate = new Date(recordingStartTime.current as string);

      GTMRecordingCompleted({
        interview_id: interviewId as string,
        question_id: ((contentsLength || 0) + 1).toString() || '',
        duration: (new Date().getTime() - recordingStartTimeDate.getTime()) / 1000,
        file_size: audioBlob.size,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
      });

      if (audioBlob.size > 50 * 1024 * 1024) {
        errorService.handle(new RecordError({ type: RecordErrorType.FILE_TOO_LARGE }));
        send({ type: 'FAILED' });
        return;
      }

      const audioFile = new File([audioBlob], 'recording.wav', {
        type: 'audio/wav',
      });

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
    }
  }, [snapshot, dispatch, funnelId, interviewId, contentsLength, send]);

  useEffect(() => {
    if (!currentRecordingAnswer || !snapshot.matches({ ready: 'uploading' })) {
      return;
    }

    const isSuccess = currentRecordingAnswer.status === ChatContentStatusType.success;
    const isIdle = currentRecordingAnswer.status === ChatContentStatusType.idle;
    const isFail = currentRecordingAnswer.status === ChatContentStatusType.fail;

    if (isSuccess || isIdle) {
      const recordingStartTimeDate = new Date(recordingStartTime.current as string);
      GTMAnswerSubmittedSuccess({
        interview_id: interviewId as string,
        question_id: ((contentsLength || 0) + 1).toString() || '',
        duration: (new Date().getTime() - recordingStartTimeDate.getTime()) / 1000,
        session_id: getSessionId() || '',
        funnel_id: funnelId || '',
      });
      send({ type: 'COMPLETED' });
    } else if (isFail) {
      send({ type: 'FAILED' });
    }
  }, [currentRecordingAnswer, snapshot, send, funnelId, interviewId, contentsLength]);

  useEffect(() => {
    if (isDisabledRecord) {
      setButtonIconSrc(DISABLED_ICON_SRC);
    } else if (snapshot.matches({ ready: 'recording' })) {
      setButtonIconSrc(RECORDING_ICON_SRC);
    } else {
      setButtonIconSrc(IDLE_ICON_SRC);
    }
  }, [isDisabledRecord, snapshot]);

  const handleRecord = () => {
    if (snapshot.matches({ ready: 'recording' })) {
      send({ type: 'STOP' });
    } else if (snapshot.can({ type: 'RECORD' })) {
      send({ type: 'RECORD' });
    }
  };

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
            snapshot.matches({ ready: 'recording' }) && styles.recording,
          ])}
        />
      )}
    </>
  );
}

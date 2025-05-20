import { InterviewEvent, Status } from './type';

export const GTMInterviewStarted = ({
  interview_id,
  interviewer_id,
  user_id,
  session_id,
  funnel_id,
  category,
}: {
  interview_id: string;
  interviewer_id: string;
  user_id: string;
  session_id: string;
  funnel_id: string;
  category: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.interview_started,
    interview_id,
    interviewer_id,
    user_id,
    session_id,
    funnel_id,
    category,
  });
};

export const GTMAnswerSubmittedSuccess = ({
  interview_id,
  question_id,
  duration,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  question_id: string;
  duration: number;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.answer_submitted,
    interview_id,
    question_id,
    status: Status.success,
    duration,
    session_id,
    funnel_id,
  });
};

export const GTMAnswerSubmittedFailed = ({
  interview_id,
  question_id,
  duration,
  session_id,
  funnel_id,
  message,
}: {
  interview_id: string;
  question_id: string;
  duration: number;
  session_id: string;
  funnel_id: string;
  message: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.answer_submitted,
    interview_id,
    question_id,
    status: Status.failed,
    duration,
    session_id,
    funnel_id,
    error_message: message,
  });
};

export const GTMInterviewCompleted = ({
  interview_id,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.interview_completed,
    interview_id,
    session_id,
    funnel_id,
  });
};

export const GTMRecordingStarted = ({
  interview_id,
  question_id,
  start_time,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  question_id: string;
  start_time: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.recording_started,
    interview_id,
    question_id,
    start_time,
    session_id,
    funnel_id,
  });
};

export const GTMRecordingCompleted = ({
  interview_id,
  question_id,
  duration,
  file_size,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  question_id: string;
  duration: number;
  file_size: number;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.recording_completed,
    interview_id,
    question_id,
    duration,
    file_size,
    session_id,
    funnel_id,
  });
};

export const GTMSTTResultSuccess = ({
  interview_id,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.stt_result,
    interview_id,
    status: Status.success,
    session_id,
    funnel_id,
  });
};

export const GTMSTTResultFailed = ({
  interview_id,
  session_id,
  funnel_id,
  error_message,
}: {
  interview_id: string;
  session_id: string;
  funnel_id: string;
  error_message: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.stt_result,
    interview_id,
    status: Status.failed,
    session_id,
    funnel_id,
    error_message,
  });
};

export const GTMAnswerDuration = ({
  interview_id,
  question_id,
  response_time,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  question_id: string;
  response_time: number;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.answer_duration,
    interview_id,
    question_id,
    response_time,
    session_id,
    funnel_id,
  });
};

export const GTMAnswerRetry = ({
  interview_id,
  question_id,
  retry_count,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  question_id: string;
  retry_count: number;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.answer_retry,
    interview_id,
    question_id,
    retry_count,
    session_id,
    funnel_id,
  });
};

export const GTMAnswerCancel = ({
  interview_id,
  last_question_id,
  reason,
  session_id,
  funnel_id,
}: {
  interview_id: string;
  last_question_id: string;
  reason: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: InterviewEvent.answer_cancel,
    interview_id,
    last_question_id,
    reason,
    session_id,
    funnel_id,
  });
};

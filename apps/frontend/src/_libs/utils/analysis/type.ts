declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export enum Status {
  success = 'success',
  failed = 'failed',
}

export enum UserEvent {
  login_attempt = 'login_attempt',
  signup_attempt = 'signup_attempt',
}

export enum InterviewerEvent {
  interviewer_selected = 'interviewer_selected',
}

export enum InterviewEvent {
  interview_started = 'interview_started',
  answer_submitted = 'answer_submitted',
  interview_completed = 'interview_completed',
  recording_started = 'recording_started',
  recording_completed = 'recording_completed',
  stt_result = 'stt_result',
  answer_duration = 'answer_duration',
  answer_retry = 'answer_retry',
  answer_cancel = 'answer_cancel',
}

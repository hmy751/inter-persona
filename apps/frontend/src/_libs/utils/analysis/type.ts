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

export enum ResultEvent {
  view_results = 'view_results',
  retry_interview = 'retry_interview',
  select_new_interviewer = 'select_new_interviewer',
}

export enum PageEvent {
  page_view = 'page_view',
  page_exit = 'page_exit',
}

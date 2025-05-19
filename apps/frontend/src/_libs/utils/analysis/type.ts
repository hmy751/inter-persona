declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export enum UserEvent {
  login_attempt = 'login_attempt',
  signup_attempt = 'signup_attempt',
}

export enum Status {
  success = 'success',
  failed = 'failed',
}

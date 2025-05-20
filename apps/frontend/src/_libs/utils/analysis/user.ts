import { Status, UserEvent } from './type';

export const GtmLoginAttemptSuccess = ({
  user_id,
  session_id,
  funnel_id,
}: {
  user_id: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    session_id,
    funnel_id,
    event: UserEvent.login_attempt,
    user_id,
    status: Status.success,
    method: 'email',
  });
};

export const GtmLoginAttemptFailed = ({
  message,
  session_id,
  funnel_id,
}: {
  message: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    session_id,
    funnel_id,
    event: UserEvent.login_attempt,
    user_id: null,
    status: Status.failed,
    method: 'email',
    error_message: message,
  });
};

export const GtmSignupAttemptSuccess = ({
  user_id,
  session_id,
  funnel_id,
}: {
  user_id: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    session_id,
    funnel_id,
    event: UserEvent.signup_attempt,
    user_id,
    status: Status.success,
  });
};

export const GtmSignupAttemptFailed = ({
  message,
  session_id,
  funnel_id,
}: {
  message: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    session_id,
    funnel_id,
    event: UserEvent.signup_attempt,
    user_id: null,
    status: Status.failed,
    error_message: message,
  });
};

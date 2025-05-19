import { InterviewerEvent, Status } from './type';

export const GTMInterviewerSelectedSuccess = ({
  user_id,
  interviewer_id,
  session_id,
  funnel_id,
  category,
}: {
  user_id: string;
  interviewer_id: string;
  session_id: string;
  funnel_id: string;
  category: string;
}) => {
  window.dataLayer.push({
    event: InterviewerEvent.interviewer_selected,
    session_id,
    funnel_id,
    user_id,
    category,
    interviewer_id,
    status: Status.success,
  });
};

export const GTMInterviewerSelectedFailed = ({
  user_id,
  interviewer_id,
  session_id,
  funnel_id,
  category,
  message,
}: {
  user_id?: string;
  interviewer_id?: string;
  session_id: string;
  funnel_id: string;
  category?: string;
  message: string;
}) => {
  window.dataLayer.push({
    event: InterviewerEvent.interviewer_selected,
    session_id,
    funnel_id,
    user_id,
    category,
    interviewer_id,
    status: Status.failed,
    error_message: message,
  });
};

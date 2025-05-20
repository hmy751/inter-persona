import { ResultEvent } from './type';

export const GTMViewResults = ({
  result_id,
  interview_id,
  user_id,
  session_id,
  funnel_id,
}: {
  result_id: string;
  interview_id: string;
  user_id: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: ResultEvent.view_results,
    result_id,
    interview_id,
    user_id,
    session_id,
    funnel_id,
  });
};

export const GTMRetryInterview = ({
  result_id,
  interview_id,
  user_id,
  session_id,
  funnel_id,
}: {
  result_id: string;
  interview_id: string;
  user_id: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: ResultEvent.retry_interview,
    result_id,
    interview_id,
    user_id,
    session_id,
    funnel_id,
  });
};

export const GTMSelectNewInterviewer = ({
  result_id,
  user_id,
  session_id,
  funnel_id,
}: {
  result_id: string;
  user_id: string;
  session_id: string;
  funnel_id: string;
}) => {
  window.dataLayer.push({
    event: ResultEvent.select_new_interviewer,
    result_id,
    user_id,
    session_id,
    funnel_id,
  });
};

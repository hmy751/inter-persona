export const VERIFY_AUTH_ERROR = {
  unauthorized: '인증되지 않은 사용자입니다.',
  expired: '토큰이 만료되었습니다.',
  invalid: '토큰이 유효하지 않습니다.',
};

export const USER_ROUTE = {
  unauthorized: '인증되지 않은 사용자입니다.',
  alreadyExists: '이미 존재하는 이메일입니다.',
  invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  registerSuccess: '회원가입에 성공했습니다.',
  loginSuccess: '로그인에 성공했습니다.',
};

export const INTERVIEWER_ROUTE = {
  notFound: '해당 인터뷰어를 찾을 수 없습니다.',
};

export const INTERVIEW_ROUTE = {
  error: {
    notFoundInterviewer: '해당 인터뷰어를 찾을 수 없습니다.',
    invalidCategory: '카테고리가 올바르지 않습니다.',
    notFoundInterview: '해당 인터뷰를 찾을 수 없습니다.',
    notFoundUser: '해당 유저를 찾을 수 없습니다.',
    chatLimit: '면접 채팅 제한 개수를 초과했습니다.',
  },
  message: {
    firstQuestion: '안녕하세요. 간단히 자기소개 부탁드립니다.',
    lastQuestion: '면접보시느라 수고하셨습니다.',
  }
};

export const RESULT_ROUTE = {
  error: {
    notFoundInterview: '해당 인터뷰를 찾을 수 없습니다.',
    failedToCreateResult: '결과 생성에 실패했습니다.',
    notFoundResult: '해당 결과를 찾을 수 없습니다.',
  },
  message: {
    alreadyExists: '이미 인터뷰 결과가 존재합니다.',
  },
};

export const SERVER_ERROR = {
  internal: '서버에 문제가 발생했습니다.',
};

export const VALIDATION_ERROR = {
  invalidInput: '입력값이 올바르지 않습니다.',
};

export const INTERVIEW_CHAT_LIMIT = 20;

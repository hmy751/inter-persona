export const VALIDATION = {
  email: {
    required: '이메일을 입력해주세요.',
    invalid: '이메일 형식이 올바르지 않습니다.',
  },
  password: {
    required: '비밀번호를 입력해주세요.',
    length: '비밀번호는 최소 8자 이상이어야 합니다.',
    lowercase: '비밀번호는 소문자를 포함해야 합니다.',
    uppercase: '비밀번호는 대문자를 포함해야 합니다.',
    number: '비밀번호는 숫자를 포함해야 합니다.',
    special: '비밀번호는 특수문자를 포함해야 합니다.',
  },
  name: {
    required: '이름을 입력해주세요.',
    length: '이름은 최소 2자 이상 최대 10자 이하여야 합니다.',
  },
};

export const VERIFY_AUTH_ERROR = {
  unauthorized: '인증되지 않은 사용자입니다.',
  expired: '토큰이 만료되었습니다.',
  invalid: '토큰이 유효하지 않습니다.',
  invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
};

export const SERVER_ERROR = {
  internal: '서버에 문제가 발생했습니다.',
};

export const VALIDATION_ERROR = {
  invalidInput: '입력값이 올바르지 않습니다.',
};

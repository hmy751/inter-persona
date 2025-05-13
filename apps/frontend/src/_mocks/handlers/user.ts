import { http, HttpResponse, delay } from 'msw';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
  RegisterResponseSchema,
  UserInfoResponseSchema,
  UserSchema,
} from '@repo/schema/user';
import { DEFAULT_PROFILE_IMAGE_URL } from '@repo/constant/name';
import { baseURL } from '@/_apis/fetcher';

const LOGIN_API_PATH = `${baseURL}/user/login`;
const REGISTER_API_PATH = `${baseURL}/user/register`;
const USER_INFO_API_PATH = `${baseURL}/user/info`;

const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'Password1!',
    name: 'Test User',
    profileImageUrl: DEFAULT_PROFILE_IMAGE_URL,
  },
];

let userIdCounter = users.length + 1;

export const userHandlers = [
  // 로그인
  http.post(LOGIN_API_PATH, async ({ request }) => {
    const body = await request.json();
    const validation = LoginRequestSchema.safeParse(body);

    if (!validation.success) {
      return HttpResponse.json(
        {
          message: '입력값이 유효하지 않습니다.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const foundUser = users.find(user => user.email === email);

    await delay(500);

    if (!foundUser) {
      return HttpResponse.json(
        LoginResponseSchema.parse({
          success: false,
          message: '등록되지 않은 사용자입니다.',
        }),
        { status: 401 }
      );
    }

    if (foundUser.password !== password) {
      return HttpResponse.json(
        LoginResponseSchema.parse({
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        }),
        { status: 401 }
      );
    }

    const responseData = LoginResponseSchema.parse({
      success: true,
      message: '로그인 성공',
    });

    return HttpResponse.json(responseData, {
      status: 201,
      headers: {
        'Set-Cookie': 'token=mock-token; Path=/; HttpOnly; Max-Age=3600',
      },
    });
  }),

  // 회원가입
  http.post(REGISTER_API_PATH, async ({ request }) => {
    const body = await request.json();
    const validation = RegisterRequestSchema.safeParse(body);

    if (!validation.success) {
      return HttpResponse.json(
        {
          message: '입력값이 유효하지 않습니다.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    if (users.some(user => user.email === email)) {
      return HttpResponse.json(
        RegisterResponseSchema.parse({
          success: false,
          message: '이미 가입된 이메일입니다.',
        }),
        { status: 400 }
      );
    }

    const newUser = UserSchema.parse({
      id: userIdCounter++,
      email,
      name,
      profileImageUrl: DEFAULT_PROFILE_IMAGE_URL,
    });
    users.push({ ...newUser, password });

    await delay(500);

    const responseData = RegisterResponseSchema.parse({
      success: true,
      message: '회원가입 성공',
    });

    return HttpResponse.json(responseData, { status: 201 });
  }),

  // 사용자 정보 조회
  http.get(USER_INFO_API_PATH, async ({ cookies }) => {
    if (!cookies.token || cookies.token !== 'mock-token') {
      return HttpResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const user = users.find(u => u.id === 1);

    await delay(300);

    if (!user) {
      return HttpResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    const responseData = UserInfoResponseSchema.parse({
      id: user.id,
      email: user.email,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
    });

    return HttpResponse.json(responseData);
  }),
];

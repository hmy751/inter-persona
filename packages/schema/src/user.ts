import { z } from 'zod';
import { VALIDATION } from '@repo/constant/message';

/**
 * 모델 스키마
 */
export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  profileImageUrl: z.string(),
});

/**
 * 요청, 응답 스키마
 */
export const LoginRequestSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: VALIDATION.email.required,
    })
    .email({
      message: VALIDATION.email.invalid,
    }),
  password: z
    .string()
    .min(8, {
      message: VALIDATION.password.length,
    })
    .regex(/[a-z]/, {
      message: VALIDATION.password.lowercase,
    })
    .regex(/\d/, {
      message: VALIDATION.password.number,
    }),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  id: z.number(),
});

export const RegisterRequestSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: VALIDATION.email.required,
      })
      .email({
        message: VALIDATION.email.invalid,
      }),
    password: z
      .string()
      .min(8, {
        message: VALIDATION.password.length,
      })
      .regex(/[a-z]/, {
        message: VALIDATION.password.lowercase,
      })
      .regex(/\d/, {
        message: VALIDATION.password.number,
      }),
    passwordConfirm: z
      .string()
      .min(8, {
        message: VALIDATION.password.length,
      })
      .regex(/[a-z]/, {
        message: VALIDATION.password.lowercase,
      })
      .regex(/\d/, {
        message: VALIDATION.password.number,
      }),
    name: z
      .string()
      .min(2, {
        message: VALIDATION.name.length,
      })
      .max(10, {
        message: VALIDATION.name.length,
      }),
    profileImage: z.optional(z.instanceof(File)),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: VALIDATION.password.mismatch,
    path: ['passwordConfirm'],
  });

export const RegisterResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  id: z.number(),
});

export const UserInfoResponseSchema = UserSchema;

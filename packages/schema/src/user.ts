import { z } from 'zod';
import { VALIDATION } from '@repo/constant/message';

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
    .regex(/[A-Z]/, {
      message: VALIDATION.password.uppercase,
    })
    .regex(/\d/, {
      message: VALIDATION.password.number,
    })
    .regex(/[!@#$%^&*]/, {
      message: VALIDATION.password.special,
    }),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  success: z.boolean(),
  message: z.string(),
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
      .regex(/[A-Z]/, {
        message: VALIDATION.password.uppercase,
      })
      .regex(/\d/, {
        message: VALIDATION.password.number,
      })
      .regex(/[!@#$%^&*]/, {
        message: VALIDATION.password.special,
      }),
    passwordConfirm: z
      .string()
      .min(8, {
        message: VALIDATION.password.length,
      })
      .regex(/[a-z]/, {
        message: VALIDATION.password.lowercase,
      })
      .regex(/[A-Z]/, {
        message: VALIDATION.password.uppercase,
      })
      .regex(/\d/, {
        message: VALIDATION.password.number,
      })
      .regex(/[!@#$%^&*]/, {
        message: VALIDATION.password.special,
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
});

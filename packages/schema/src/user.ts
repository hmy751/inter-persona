import { z } from 'zod';
import { ERROR_MESSAGE } from '@repo/constant/message';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: ERROR_MESSAGE.email.required,
    })
    .email({
      message: ERROR_MESSAGE.email.invalid,
    }),
  password: z
    .string()
    .min(8, {
      message: ERROR_MESSAGE.password.length,
    })
    .regex(/[a-z]/, {
      message: ERROR_MESSAGE.password.lowercase,
    })
    .regex(/[A-Z]/, {
      message: ERROR_MESSAGE.password.uppercase,
    })
    .regex(/\d/, {
      message: ERROR_MESSAGE.password.number,
    })
    .regex(/[!@#$%^&*]/, {
      message: ERROR_MESSAGE.password.special,
    }),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: ERROR_MESSAGE.email.required,
    })
    .email({
      message: ERROR_MESSAGE.email.invalid,
    }),
  password: z
    .string()
    .min(8, {
      message: ERROR_MESSAGE.password.length,
    })
    .regex(/[a-z]/, {
      message: ERROR_MESSAGE.password.lowercase,
    })
    .regex(/[A-Z]/, {
      message: ERROR_MESSAGE.password.uppercase,
    })
    .regex(/\d/, {
      message: ERROR_MESSAGE.password.number,
    })
    .regex(/[!@#$%^&*]/, {
      message: ERROR_MESSAGE.password.special,
    }),
  name: z
    .string()
    .min(2, {
      message: ERROR_MESSAGE.name.length,
    })
    .max(10, {
      message: ERROR_MESSAGE.name.length,
    }),
  profileImage: z.string().optional(),
});

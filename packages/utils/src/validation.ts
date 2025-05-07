import { VALIDATION } from '@repo/constant/message';

export const validateEmail = (value: string) => {
  if (!value) {
    return VALIDATION.email.required;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return VALIDATION.email.invalid;
  }

  return true;
};

export const validatePassword = (value: string) => {
  if (!value) {
    return VALIDATION.password.required;
  }

  if (value.length < 8) {
    return VALIDATION.password.length;
  }

  if (!/[a-z]/.test(value)) {
    return VALIDATION.password.lowercase;
  }

  if (!/[A-Z]/.test(value)) {
    return VALIDATION.password.uppercase;
  }

  if (!/\d/.test(value)) {
    return VALIDATION.password.number;
  }

  if (!/[!@#$%^&*]/.test(value)) {
    return VALIDATION.password.special;
  }

  return true;
};

export const validateName = (value: string) => {
  if (!value) {
    return VALIDATION.name.required;
  }

  if (value.length < 2) {
    return VALIDATION.name.length;
  }

  if (value.length > 10) {
    return VALIDATION.name.length;
  }

  return true;
};

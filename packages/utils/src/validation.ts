import { ERROR_MESSAGE } from "@repo/constant/message";

export const validateEmail = (value: string) => {
  if (!value) {
    return ERROR_MESSAGE.email.required;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return ERROR_MESSAGE.email.invalid;
  }

  return true;
};

export const validatePassword = (value: string) => {
  if (!value) {
    return ERROR_MESSAGE.password.required;
  }

  if (value.length < 8) {
    return ERROR_MESSAGE.password.length;
  }

  if (!/[a-z]/.test(value)) {
    return ERROR_MESSAGE.password.lowercase;
  }

  if (!/[A-Z]/.test(value)) {
    return ERROR_MESSAGE.password.uppercase;
  }

  if (!/\d/.test(value)) {
    return ERROR_MESSAGE.password.number;
  }

  if (!/[!@#$%^&*]/.test(value)) {
    return ERROR_MESSAGE.password.special;
  }

  return true;
};

export const validateName = (value: string) => {
  if (!value) {
    return ERROR_MESSAGE.name.required;
  }

  if (value.length < 2) {
    return ERROR_MESSAGE.name.length;
  }

  if (value.length > 10) {
    return ERROR_MESSAGE.name.length;
  }

  return true;
};


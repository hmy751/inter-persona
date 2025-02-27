"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Field from "@repo/ui/Field";
import Input from "@repo/ui/Input";
import Button from "@repo/ui/Button";
import styles from "./FormSection.module.css";
import useUserStore from "@/_store/zustand/useUserStore";
import { useFormField } from "@/_hooks/useFormField";
import ImageInput from "@repo/ui/ImageInput";
import { useState } from "react";

const validateEmail = (email: string) => {
  if (!email) return "이메일을 입력해주세요.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "이메일 형식으로 입력해주세요.";
  return "";
};

const validatePassword = (password: string) => {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < 10) return "비밀번호는 최소 10자 이상이어야 합니다.";

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password) && /[a-z].*[a-z]/.test(password); // 소문자 최소 2개
  const hasDigit = /\d/.test(password);

  if (!(hasUpperCase && hasLowerCase && hasDigit)) {
    return "비밀번호는 대문자 1개 이상, 소문자 2개 이상, 숫자 1개 이상을 포함해야 합니다.";
  }

  return "";
};

const validatePasswordConfirm = (
  passwordConfirm: string,
  originalPassword: string
) => {
  if (!passwordConfirm) return "비밀번호를 입력해주세요.";
  if (passwordConfirm.length < 10)
    return "비밀번호는 최소 10자 이상이어야 합니다.";

  const hasUpperCase = /[A-Z]/.test(passwordConfirm);
  const hasLowerCase =
    /[a-z]/.test(passwordConfirm) && /[a-z].*[a-z]/.test(passwordConfirm); // 소문자 최소 2개
  const hasDigit = /\d/.test(passwordConfirm);

  if (!(hasUpperCase && hasLowerCase && hasDigit)) {
    return "비밀번호는 대문자 1개 이상, 소문자 2개 이상, 숫자 1개 이상을 포함해야 합니다.";
  }

  if (originalPassword !== passwordConfirm)
    return "비밀번호가 일치하지 않습니다.";

  return "";
};

const validateName = (name: string) => {
  if (!name) return "이름을 입력해주세요.";
  if (name.length < 2) return "이름은 최소 2자 이상이어야 합니다.";
  return "";
};

const validateProfileImage = (file: File | null) => {
  if (!file) return;

  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > 5) return "이미지 크기는 5MB 이하여야 합니다.";

  const acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!acceptedTypes.includes(file.type))
    return "JPG, PNG 형식의 이미지만 업로드 가능합니다.";

  return;
};

export default function SignupForm() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const emailField = useFormField({ validator: validateEmail });
  const nameField = useFormField({ validator: validateName });
  const passwordField = useFormField({ validator: validatePassword });
  const passwordConfirmField = useFormField({
    validator: validatePasswordConfirm,
    dependencies: [passwordField.value],
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageError, setProfileImageError] = useState<
    string | undefined
  >();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailField.isTouched) emailField.setTouched(true);
    if (!nameField.isTouched) nameField.setTouched(true);
    if (!passwordField.isTouched) passwordField.setTouched(true);
    if (!passwordConfirmField.isTouched) passwordConfirmField.setTouched(true);

    const emailError = emailField.error;
    const nameError = nameField.error;
    const passwordError = passwordField.error;
    const passwordConfirmError = passwordConfirmField.error;

    const imageError = validateProfileImage(profileImage);
    setProfileImageError(imageError);

    if (emailError) {
      emailField.setError(emailError);
    }

    if (nameError) {
      nameField.setError(nameError);
    }

    if (passwordError) {
      passwordField.setError(passwordError);
    }

    if (passwordConfirmError) {
      passwordConfirmField.setError(passwordConfirmError);
    }

    if (emailError || nameError || passwordError || passwordConfirmError)
      return;

    console.log(
      profileImage,
      emailField.value,
      nameField.value,
      passwordField.value,
      passwordConfirmField.value
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field
        label="프로필 이미지"
        elementHeight="var(--space-12)"
        message={profileImageError}
      >
        <ImageInput
          size="xl"
          setImage={(file) => setProfileImage(file)}
          onValidate={validateProfileImage}
        />
      </Field>

      <Field label="이메일" message={emailField.error}>
        <Input
          type="email"
          value={emailField.value}
          onChange={(e) => emailField.setValue(e.target.value)}
          placeholder="Enter Text..."
          isFocused={emailField.isFocused}
          isTouched={emailField.isTouched}
          isError={emailField.error}
          onFocusChange={emailField.setFocused}
          onTouchChange={emailField.setTouched}
        />
      </Field>

      <Field label="이름" message={nameField.error}>
        <Input
          type="text"
          placeholder="Enter Text..."
          value={nameField.value}
          onChange={(e) => nameField.setValue(e.target.value)}
          isFocused={nameField.isFocused}
          isTouched={nameField.isTouched}
          isError={nameField.error}
          onFocusChange={nameField.setFocused}
          onTouchChange={nameField.setTouched}
        />
      </Field>

      <Field label="비밀번호" message={passwordField.error}>
        <Input
          type="password"
          placeholder="Enter Text..."
          value={passwordField.value}
          onChange={(e) => passwordField.setValue(e.target.value)}
          isFocused={passwordField.isFocused}
          isTouched={passwordField.isTouched}
          isError={passwordField.error}
          onFocusChange={passwordField.setFocused}
          onTouchChange={passwordField.setTouched}
        />
      </Field>
      <Field label="비밀번호 확인" message={passwordConfirmField.error}>
        <Input
          type="password"
          placeholder="Enter Text..."
          value={passwordConfirmField.value}
          onChange={(e) => passwordConfirmField.setValue(e.target.value)}
          isFocused={passwordConfirmField.isFocused}
          isTouched={passwordConfirmField.isTouched}
          isError={passwordConfirmField.error}
          onFocusChange={passwordConfirmField.setFocused}
          onTouchChange={passwordConfirmField.setTouched}
        />
      </Field>

      <Button variant="primary" fullWidth type="submit">
        회원가입
      </Button>
    </form>
  );
}

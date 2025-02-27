"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchLogin } from "@/_apis/user";
import { useRouter } from "next/navigation";
import Field from "@repo/ui/Field";
import Input from "@repo/ui/Input";
import Button from "@repo/ui/Button";
import styles from "./FormSection.module.css";
import useUserStore from "@/_store/zustand/useUserStore";
import { useFormField } from "@/_hooks/useFormField";

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

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const emailField = useFormField({ validator: validateEmail });
  const passwordField = useFormField({ validator: validatePassword });

  const loginMutation = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      if (!data) return;
      setUser(data);
      router.push("/interviewer");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailField.isTouched) emailField.setTouched(true);
    if (!passwordField.isTouched) passwordField.setTouched(true);

    const emailError = emailField.error;
    const passwordError = passwordField.error;

    if (emailError) {
      emailField.setError(emailError);
    }

    if (passwordError) {
      passwordField.setError(passwordError);
    }

    if (emailError || passwordError) return;

    loginMutation.mutate({
      email: emailField.value,
      password: passwordField.value,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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

      <Field label="비밀번호" message={passwordField.error}>
        <Input
          type="password"
          value={passwordField.value}
          onChange={(e) => passwordField.setValue(e.target.value)}
          placeholder="Enter Text..."
          isFocused={passwordField.isFocused}
          isTouched={passwordField.isTouched}
          isError={passwordField.error}
          onFocusChange={passwordField.setFocused}
          onTouchChange={passwordField.setTouched}
        />
      </Field>

      <Button variant="primary" fullWidth type="submit">
        시작하기
      </Button>
    </form>
  );
}

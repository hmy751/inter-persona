"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchLogin } from "@/_apis/user";
import { useRouter } from "next/navigation";
import InputField from "@repo/ui/InputField";
import Input from "@repo/ui/Input";
import Button from "@repo/ui/Button";
import styles from "./FormSection.module.css";
import useUserStore from "@/_store/zustand/useUserStore";

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

export default function FormSection() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (emailTouched) {
      setEmailError(validateEmail(email));
    }
  }, [email, emailTouched]);

  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (passwordTouched) {
      setPasswordError(validatePassword(password));
    }
  }, [password, passwordTouched]);

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

    if (!emailTouched) setEmailTouched(true);
    if (!passwordTouched) setPasswordTouched(true);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) {
      setEmailError(emailError);
    }

    if (passwordError) {
      setPasswordError(passwordError);
    }

    if (emailError || passwordError) return;

    loginMutation.mutate({ email, password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField label="이메일" message={emailError}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Text..."
          isFocused={emailFocused}
          isTouched={emailTouched}
          isError={emailError}
          onFocusChange={setEmailFocused}
          onTouchChange={setEmailTouched}
        />
      </InputField>

      <InputField label="비밀번호" message={passwordError}>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Text..."
          isFocused={passwordFocused}
          isTouched={passwordTouched}
          isError={passwordError}
          onFocusChange={setPasswordFocused}
          onTouchChange={setPasswordTouched}
        />
      </InputField>

      <Button variant="primary" fullWidth type="submit">
        시작하기
      </Button>
    </form>
  );
}

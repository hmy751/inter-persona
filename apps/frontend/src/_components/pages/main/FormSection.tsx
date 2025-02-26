"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "./FormSection.module.css";
import Text from "@repo/ui/Text";
import Button from "@repo/ui/Button";

export default function FormSection() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? <LoginForm /> : <SignupForm />}
      <div className={styles.toggleButton} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? (
          <Text as="p" size="sm" align="center">
            계정이 없으신가요?
            <Button size="sm" variant="text" onClick={() => setIsLogin(false)}>
              회원가입
            </Button>
          </Text>
        ) : (
          <Text as="p" size="sm" align="center">
            이미 계정이 있으신가요?{" "}
            <Button size="sm" variant="text" onClick={() => setIsLogin(true)}>
              로그인
            </Button>
          </Text>
        )}
      </div>
    </>
  );
}

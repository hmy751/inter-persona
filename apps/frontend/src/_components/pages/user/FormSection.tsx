'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import styles from './FormSection.module.css';
import Text from '@repo/ui/Text';
import Button from '@repo/ui/Button';

export default function FormSection() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return (
    <>
      {isLoginForm ? <LoginForm /> : <SignupForm onSuccess={() => setIsLoginForm(true)} />}
      <div className={styles.toggleButton} onClick={() => setIsLoginForm(!isLoginForm)}>
        {isLoginForm ? (
          <Text key="loginButton" as="p" size="sm" align="center">
            계정이 없으신가요?
            <Button size="sm" variant="text" onClick={() => setIsLoginForm(false)}>
              회원가입
            </Button>
          </Text>
        ) : (
          <Text key="signupButton" as="p" size="sm" align="center">
            이미 계정이 있으신가요?{' '}
            <Button size="sm" variant="text" onClick={() => setIsLoginForm(true)}>
              로그인
            </Button>
          </Text>
        )}
      </div>
    </>
  );
}

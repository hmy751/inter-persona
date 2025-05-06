'use client';

import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Field from '@repo/ui/Field';
import Input from '@repo/ui/Input';
import Button from '@repo/ui/Button';
import { VALIDATION } from '@repo/constant/message';
import styles from './FormSection.module.css';
import ProfileInput from './ProfileInput';
import { RegisterSchema } from '@repo/schema/user';

export default function SignupForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Field label="프로필 이미지" elementHeight="100%" message={errors.profileImage?.message}>
        <Controller
          name="profileImage"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <ProfileInput
              ref={ref}
              size="xl"
              setImage={file => {
                onChange(file);
              }}
            />
          )}
        />
      </Field>

      <Field label="이메일" message={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched } }) => (
            <Input
              type="text"
              isTouched={isTouched}
              placeholder={VALIDATION.email.required}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
      </Field>

      <Field label="이름" message={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched } }) => (
            <Input
              type="text"
              isTouched={isTouched}
              placeholder={VALIDATION.name.required}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
      </Field>

      <Field label="비밀번호" message={errors.password?.message}>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched } }) => (
            <Input
              type="password"
              isTouched={isTouched}
              placeholder={VALIDATION.password.required}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
      </Field>

      <Field label="비밀번호 확인" message={errors.passwordConfirm?.message}>
        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched } }) => (
            <Input
              type="password"
              isTouched={isTouched}
              placeholder={VALIDATION.password.required}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
      </Field>

      <Button variant="primary" fullWidth type="submit">
        회원가입
      </Button>
    </form>
  );
}

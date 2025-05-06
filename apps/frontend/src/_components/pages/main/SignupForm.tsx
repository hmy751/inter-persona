'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Field from '@repo/ui/Field';
import Input from '@repo/ui/Input';
import Button from '@repo/ui/Button';
import { VALIDATION } from '@repo/constant/message';
import styles from './FormSection.module.css';
import useUserStore from '@/_store/zustand/useUserStore';
import ProfileInput from './ProfileInput';
import { RegisterSchema } from '@repo/schema/user';

const validateProfileImage = (file: File | null) => {
  if (!file) {
    return;
  }

  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > 5) {
    return '이미지 크기는 5MB 이하여야 합니다.';
  }

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!acceptedTypes.includes(file.type)) {
    return 'JPG, PNG 형식의 이미지만 업로드 가능합니다.';
  }

  return;
};

export default function SignupForm() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const {
    register,
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
      {/* <Field label="프로필 이미지" elementHeight="var(--space-12)" message={profileImageError}>
        <Controller
          name="profileImage"
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <ProfileInput
              ref={ref} // ref 전달 (ProfileInput이 forwardRef를 사용해야 할 수 있음)
              size="xl"
              currentImage={value} // Controller의 value를 전달
              setImage={file => {
                onChange(file); // react-hook-form의 onChange 호출
                // 필요하다면 여기에서 validateProfileImage를 호출하고 setProfileImageError 설정
                const validationMessage = validateProfileImage(file);
                setProfileImageError(validationMessage);
              }}
              // onValidate는 ProfileInput 내부에서 처리하거나, setImage 내에서 직접 호출
            />
          )}
        />
      </Field> */}

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

'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Field from '@repo/ui/Field';
import Input from '@repo/ui/Input';
import Button from '@repo/ui/Button';
import { VALIDATION } from '@repo/constant/message';
import styles from './FormSection.module.css';
import ProfileInput from './ProfileInput';
import { RegisterRequestSchema, RegisterResponseSchema } from '@repo/schema/user';
import { fetchRegister } from '@/_apis/user';
import { useToastStore } from '@repo/store/useToastStore';
import { useConfirmDialogStore } from '@repo/store/useConfirmDialogStore';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';
import { GtmSignupAttemptFailed, GtmSignupAttemptSuccess } from '@/_libs/utils/analysis/user';
import { getSessionId } from '@/_libs/utils/session';

export default function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { addToast } = useToastStore();
  const { setConfirm } = useConfirmDialogStore();
  const { funnelId } = useFunnelIdStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<z.infer<typeof RegisterRequestSchema>>({
    resolver: zodResolver(RegisterRequestSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterRequestSchema>) => {
    if (!isValid) {
      return;
    }

    const formData = new FormData();

    formData.append('email', data.email);
    formData.append('name', data.name);
    formData.append('password', data.password);
    formData.append('passwordConfirm', data.passwordConfirm);

    if (data.profileImage && data.profileImage instanceof File) {
      formData.append('profileImage', data.profileImage);
    }

    try {
      const data = await fetchRegister(formData);

      const validationResult = RegisterResponseSchema.safeParse(data);

      if (!validationResult.success) {
        GtmSignupAttemptFailed({
          message: '응답 성공, 스키마 검증 실패',
          session_id: getSessionId(),
          funnel_id: funnelId || '',
        });

        addToast({
          title: '회원가입 실패',
          description: '서버에 문제가 발생했습니다. 다시 시도해주세요.',
          duration: 3000,
        });
        return;
      }

      GtmSignupAttemptSuccess({
        user_id: validationResult.data.id.toString(),
        session_id: getSessionId(),
        funnel_id: funnelId || '',
      });

      setConfirm('회원가입 성공', '회원가입이 완료되었습니다.', onSuccess);
    } catch (error) {
      const description = error instanceof Error ? error.message : '서버에 문제가 발생했습니다. 다시 시도해주세요.';

      GtmSignupAttemptFailed({
        message: description,
        session_id: getSessionId(),
        funnel_id: funnelId || '',
      });

      addToast({
        title: '회원가입 실패',
        description,
        duration: 3000,
      });
    }
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
              autoComplete="signup-email"
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
              autoComplete="signup-name"
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
              autoComplete="signup-password"
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
              autoComplete="signup-password-confirm"
            />
          )}
        />
      </Field>

      <Button variant="primary" fullWidth type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
        회원가입
      </Button>
    </form>
  );
}

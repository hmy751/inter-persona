'use client';

import { useQueryClient } from '@tanstack/react-query';
import { fetchLogin } from '@/_apis/user';
import { useRouter } from 'next/navigation';
import Field from '@repo/ui/Field';
import Input from '@repo/ui/Input';
import Button from '@repo/ui/Button';
import styles from './FormSection.module.css';
import { Controller, useForm } from 'react-hook-form';
import { LoginRequestSchema, LoginResponseSchema } from '@repo/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VALIDATION } from '@repo/constant/message';
import { useToastStore } from '@repo/store/useToastStore';
import { getSessionId } from '@/_libs/utils/session';
import { GtmLoginAttemptFailed, GtmLoginAttemptSuccess } from '@/_libs/utils/analysis/user';
import { useFunnelIdStore } from '@/_store/zustand/useFunnelIdStore';

export default function LoginForm() {
  const router = useRouter();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();
  const { funnelId } = useFunnelIdStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<z.infer<typeof LoginRequestSchema>>({
    resolver: zodResolver(LoginRequestSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginRequestSchema>) => {
    if (!isValid) {
      return;
    }

    try {
      const responseData = await fetchLogin(data);

      const validationResult = LoginResponseSchema.safeParse(responseData);

      if (!validationResult.success) {
        GtmLoginAttemptFailed({
          message: '응답 성공, 스키마 검증 실패',
          session_id: getSessionId(),
          funnel_id: funnelId || '',
        });

        addToast({
          title: '로그인 실패',
          description: '서버 응답 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
          duration: 3000,
        });
        return;
      }

      GtmLoginAttemptSuccess({
        user_id: validationResult.data.id.toString(),
        session_id: getSessionId(),
        funnel_id: funnelId || '',
      });

      addToast({
        title: '로그인 성공',
        description: '로그인에 성공했습니다.',
        duration: 3000,
      });

      await queryClient.invalidateQueries({ queryKey: ['user', 'info'] });

      router.push('/interviewer');
    } catch (error) {
      const description = error instanceof Error ? error.message : '서버에 문제가 발생했습니다. 다시 시도해주세요.';

      GtmLoginAttemptFailed({
        message: description,
        session_id: getSessionId(),
        funnel_id: funnelId || '',
      });

      addToast({
        title: '로그인 실패',
        description,
        duration: 3000,
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Field label="이메일" message={errors['email']?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched } }) => (
            <Input
              type="email"
              isTouched={isTouched}
              placeholder={VALIDATION.email.required}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
      </Field>

      <Field label="비밀번호" message={errors['password']?.message}>
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

      <Button variant="primary" fullWidth type="submit" disabled={isSubmitting || !isValid} isLoading={isSubmitting}>
        로그인
      </Button>
    </form>
  );
}

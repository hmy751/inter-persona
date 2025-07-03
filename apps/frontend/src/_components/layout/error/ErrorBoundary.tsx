'use client';

import { ErrorBoundary as ReactErrorBoundary, FallbackProps as ReactFallbackProps } from 'react-error-boundary';
import { useQueryErrorResetBoundary, useQueryClient, QueryKey } from '@tanstack/react-query';
import { useCallback } from 'react';
import { errorService } from '@/_libs/error/service';
import { useDispatch } from 'react-redux';
import { resetChatState } from '@/_store/redux/features/chat/slice';

type ReduxStoreName = 'chat';

export type ErrorFallbackProps = ReactFallbackProps;

interface ResetConfig {
  queryKeysToRemove?: QueryKey[];
  reduxNameToRemove?: ReduxStoreName[];
  customResetFns?: (() => void)[];
}

interface Props {
  children: React.ReactNode;
  resetConfig: ResetConfig;
  fallbackRender: (props: ErrorFallbackProps) => React.ReactNode;
}

export function ErrorBoundary({ children, resetConfig = {}, fallbackRender }: Props) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { reset } = useQueryErrorResetBoundary();

  const handleReset = useCallback(() => {
    const { queryKeysToRemove, reduxNameToRemove, customResetFns } = resetConfig;

    if (customResetFns) {
      customResetFns.forEach(fn => fn());
    }

    if (queryKeysToRemove) {
      queryKeysToRemove.forEach(queryKey => {
        queryClient.resetQueries({ queryKey: queryKey });
      });
    } else {
      reset();
    }

    if (reduxNameToRemove) {
      reduxNameToRemove.forEach(name => {
        switch (name) {
          case 'chat':
            dispatch(resetChatState());
            break;
        }
      });
    }
  }, [resetConfig, queryClient, reset, dispatch]);

  return (
    <ReactErrorBoundary
      onReset={handleReset}
      fallbackRender={fallbackRender}
      onError={(error, info) => {
        errorService.handle(error, {
          type: 'silent',
          context: `Component Stack: ${info.componentStack}`,
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

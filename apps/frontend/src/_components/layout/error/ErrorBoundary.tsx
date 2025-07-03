'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary, useQueryClient, QueryKey } from '@tanstack/react-query';
import { useCallback } from 'react';
import { errorService } from '@/_libs/error/service';
import { useDispatch } from 'react-redux';
import { resetChatState } from '@/_store/redux/features/chat/slice';

type ReduxStoreName = 'chat';

interface ResetConfig {
  queryKeysToRemove?: QueryKey[];
  reduxNameToRemove?: ReduxStoreName[];
  customResetFns?: (() => void)[];
}

interface Props {
  children: React.ReactNode;
  resetConfig: ResetConfig;
  fallbackRender: React.ReactNode;
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
      queryClient.resetQueries({ queryKey: queryKeysToRemove });
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
      fallbackRender={() => fallbackRender}
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

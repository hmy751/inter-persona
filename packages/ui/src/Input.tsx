import { forwardRef, MutableRefObject, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isFocused?: boolean;
  isTouched?: boolean;
  isError?: string;
  placeholder?: string;
  isDisabled?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  onTouchChange?: (isTouched: boolean) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { isFocused, isTouched, isError, placeholder, isDisabled, onFocusChange, onTouchChange, ...restProps }: InputProps,
    ref: React.Ref<HTMLInputElement>
  ): React.ReactElement => {
    const internalInputRef = useRef<HTMLInputElement>(null);

    const assignRef = useCallback(
      (element: HTMLInputElement) => {
        if (element) {
          (internalInputRef as MutableRefObject<HTMLInputElement>).current = element;
        }

        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as MutableRefObject<HTMLInputElement>).current = element;
        }
      },
      [ref]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        onFocusChange?.(true);

        if (!isTouched) {
          onTouchChange?.(true);
        }

        restProps.onFocus?.(e);
      },
      [isTouched, onTouchChange, onFocusChange, restProps]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        onFocusChange?.(false);
        restProps.onBlur?.(e);
      },
      [onFocusChange, restProps]
    );

    useEffect(() => {
      if (!isTouched && internalInputRef.current) {
        const handleTouch = () => {
          onTouchChange?.(true);
        };

        internalInputRef.current.addEventListener('touchstart', handleTouch, {
          once: true,
        });
        internalInputRef.current.addEventListener('mousedown', handleTouch, {
          once: true,
        });

        return () => {
          internalInputRef.current?.removeEventListener('touchstart', handleTouch);
          internalInputRef.current?.removeEventListener('mousedown', handleTouch);
        };
      }
    }, [isTouched, onTouchChange]);

    return (
      <input
        ref={assignRef}
        placeholder={placeholder}
        className={clsx(
          styles.input,
          isFocused && styles.isFocused,
          isTouched && styles.isTouched,
          isError && styles.isError,
          isDisabled && styles.isDisabled
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...restProps}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;

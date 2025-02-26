import { useEffect, useRef } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isFocused?: boolean;
  isTouched?: boolean;
  isError?: string;
  placeholder?: string;
  isDisabled?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  onTouchChange?: (isTouched: boolean) => void;
}

export default function Input({
  isFocused,
  isTouched,
  isError,
  placeholder,
  isDisabled,
  onFocusChange,
  onTouchChange,
  ...restProps
}: InputProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocusChange?.(true);

    if (!isTouched) {
      onTouchChange?.(true);
    }

    restProps.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocusChange?.(false);
    restProps.onBlur?.(e);
  };

  useEffect(() => {
    if (!isTouched && inputRef.current) {
      const handleTouch = () => {
        onTouchChange?.(true);
      };

      inputRef.current.addEventListener("touchstart", handleTouch, {
        once: true,
      });
      inputRef.current.addEventListener("mousedown", handleTouch, {
        once: true,
      });

      return () => {
        inputRef.current?.removeEventListener("touchstart", handleTouch);
        inputRef.current?.removeEventListener("mousedown", handleTouch);
      };
    }
  }, [isTouched, onTouchChange]);

  return (
    <input
      ref={inputRef}
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

import { useState, useEffect } from "react";

type ValidatorFn = (value: string) => string;

interface UseFormFieldProps {
  initialValue?: string;
  validator?: ValidatorFn;
}

interface FormFieldState {
  value: string;
  isFocused: boolean;
  isTouched: boolean;
  error: string;
  setValue: (value: string) => void;
  setFocused: (isFocused: boolean) => void;
  setTouched: (isTouched: boolean) => void;
  reset: () => void;
  setError: (error: string) => void;
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused: boolean;
    isTouched: boolean;
    isError: string;
    onFocusChange: (isFocused: boolean) => void;
    onTouchChange: (isTouched: boolean) => void;
  };
}

export function useFormField({
  initialValue = "",
  validator,
}: UseFormFieldProps = {}): FormFieldState {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setFocused] = useState(false);
  const [isTouched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isTouched && validator) {
      setError(validator(value));
    }
  }, [value, isTouched, validator]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(initialValue);
    setFocused(false);
    setTouched(false);
    setError("");
  };

  return {
    value,
    isFocused,
    isTouched,
    error,
    setValue,
    setFocused,
    setTouched,
    reset,
    setError,
    inputProps: {
      value,
      onChange: handleChange,
      isFocused,
      isTouched,
      isError: error,
      onFocusChange: setFocused,
      onTouchChange: setTouched,
    },
  };
}

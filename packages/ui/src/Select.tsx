import React, {
  createContext,
  forwardRef,
  SelectHTMLAttributes,
  useContext,
  ReactNode,
  OptionHTMLAttributes,
  useState,
  FocusEvent,
} from 'react';
import clsx from 'clsx';
import styles from './Select.module.css';

interface SelectContextProps {
  value?: string | number;
  onValueChange?: (value: string) => void;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

interface SelectRootProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  children: ReactNode;
  value?: string | number;
  onValueChange?: (value: string) => void;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isError?: string;
  placeholder?: string;
}

export const SelectRoot = forwardRef<HTMLSelectElement, SelectRootProps>(
  (
    {
      children,
      value,
      fullWidth,
      size,
      onValueChange,
      isError,
      placeholder,
      className,
      onChange,
      onFocus,
      onBlur,
      ...restProps
    }: SelectRootProps,
    ref
  ) => {
    const [isFocusedInternally, setIsFocusedInternally] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange?.(event.target.value);
      onChange?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLSelectElement>) => {
      setIsFocusedInternally(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLSelectElement>) => {
      setIsFocusedInternally(false);
      onBlur?.(event);
    };

    return (
      <SelectContext.Provider value={{ value, onValueChange }}>
        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(
            styles.select,
            styles[`size-${size}`],
            fullWidth && styles.fullWidth,
            isError && styles.isError,
            isFocusedInternally && (isError ? 'global-focus-visible-error' : 'global-focus-visible-default'),
            className
          )}
          {...restProps}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
      </SelectContext.Provider>
    );
  }
);

SelectRoot.displayName = 'Select.Root';

interface SelectOptionProps extends OptionHTMLAttributes<HTMLOptionElement> {}

export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ children, ...restProps }: SelectOptionProps, ref) => {
    return (
      <option ref={ref} {...restProps}>
        {children}
      </option>
    );
  }
);

SelectOption.displayName = 'Select.Option';

export const Select = Object.assign(SelectRoot, {
  Option: SelectOption,
});

Select.displayName = 'Select';

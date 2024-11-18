/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLInputTypeAttribute, forwardRef } from "react";
import { ChangeHandler, Noop, RefCallBack } from "react-hook-form";

interface IProps {
  type: HTMLInputTypeAttribute;
  name: string;
  label: string;
  value?: any;
  onChange?: ChangeHandler | ((...event: any[]) => void);
  onBlur?: ChangeHandler | Noop;
  ref?: RefCallBack;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

// eslint-disable-next-line react/display-name
const Input = forwardRef<any, IProps>((props, ref) => {
  const {
    name,
    label,
    error,
    value,
    helperText,
    onBlur,
    onChange,
    disabled,
    required,
    type,
    max,
    maxLength,
    min,
    minLength,
    pattern,
  } = props;

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-black dark:text-zinc-50" htmlFor={name}>
        {label}
      </label>

      <input
        className={`py-3 px-2 text-sm border-2 rounded-md focus:outline-none focus:border-emerald-400 ${
          error
            ? "border-red-500 dark:border-red-500"
            : "border-gray-100 dark:border-zinc-500"
        } transition-colors duration-300 dark:bg-zinc-900 dark:border dark:text-white`}
        type={type}
        id={name}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        name={name}
        required={required}
        pattern={pattern}
        ref={ref}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
      />

      {helperText && (
        <p className={`mt-2 text-sm ${error && "text-red-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;

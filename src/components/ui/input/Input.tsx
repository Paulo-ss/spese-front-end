/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HTMLInputTypeAttribute,
  MouseEvent,
  ReactNode,
  forwardRef,
} from "react";
import { ChangeHandler, Noop, RefCallBack } from "react-hook-form";

interface IProps {
  type: HTMLInputTypeAttribute;
  name: string;
  label?: string;
  value?: any;
  onChange?: ChangeHandler | ((...event: any[]) => void);
  onBlur?: ChangeHandler | Noop;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
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
  endAdortment?: ReactNode;
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
    onClick,
    disabled,
    required,
    type,
    max,
    maxLength,
    min,
    minLength,
    pattern,
    endAdortment,
  } = props;

  return (
    <div className="flex flex-col relative">
      <label className="mb-2 text-black dark:text-zinc-50" htmlFor={name}>
        {label}
      </label>

      <div className="w-full flex items-center relative">
        <input
          className={`w-full py-3 px-2 text-sm border-2 rounded-md focus:outline-none focus:border-emerald-400 ${
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
          onClick={onClick}
        />

        {endAdortment && (
          <div className="flex absolute right-0 w-10">{endAdortment}</div>
        )}
      </div>

      {helperText && (
        <p className={`mt-2 text-sm ${error && "text-red-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;

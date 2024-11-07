"use client";

import { ReactNode } from "react";
import ReactSelect, { FormatOptionLabelMeta } from "react-select";
import { PropsValue } from "react-select";

interface IProps<T> {
  value: PropsValue<T>;
  defaultValue?: PropsValue<T>;
  options: T[];
  onChange: (...event: any[]) => void;
  label: string;
  name: string;
  error?: boolean;
  helperText?: string;
  formatOptionLabel?:
    | ((data: T, formatOptionLabelMeta: FormatOptionLabelMeta<T>) => ReactNode)
    | undefined;
  isDisabled?: boolean;
}

const Select = <T,>({
  value,
  defaultValue,
  options,
  onChange,
  label,
  name,
  error,
  helperText,
  formatOptionLabel,
  isDisabled,
}: IProps<T>) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-black dark:text-zinc-50" htmlFor={name}>
        {label}
      </label>

      <ReactSelect
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        options={options}
        formatOptionLabel={formatOptionLabel}
        name={name}
        id={name}
        instanceId={name}
        isDisabled={isDisabled}
      />

      {helperText && (
        <p className={`mt-2 text-sm ${error && "text-red-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;

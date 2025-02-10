"use client";

import { FC } from "react";
import Label from "../label/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { IconCalendar, IconQuestionMark } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { pt } from "date-fns/locale/pt";
import { Calendar } from "../calendar";
import { SelectSingleEventHandler } from "react-day-picker";

interface IProps {
  value: Date;
  onChange: SelectSingleEventHandler | undefined;
  locale: string;
  label: string;
  error?: boolean;
  helperText?: string;
  disableFuture?: boolean;
  disabled?: boolean;
  info?: string;
}

const DatePicker: FC<IProps> = ({
  value,
  label,
  onChange,
  error,
  helperText,
  locale,
  disableFuture,
  disabled,
  info,
}) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Label label={t(label)} name="date" />

        {info && (
          <Popover>
            <PopoverTrigger asChild disabled={disabled}>
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-zinc-950 text-zinc-50 dark:bg-white dark:text-zinc-950 shadow-md cursor-pointer">
                <IconQuestionMark />
              </span>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <div className="italic p-2">{info}</div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <div
            className={`flex justify-between items-center py-3 px-2 text-sm border-2 rounded-md focus:outline-none focus:border-emerald-400 ${
              error
                ? "border-red-500 dark:border-red-500"
                : "border-gray-100 dark:border-zinc-500"
            } transition-colors duration-300 dark:bg-zinc-900 dark:border dark:text-white ${
              disabled && "cursor-not-allowed"
            }`}
          >
            {value ? (
              format(value, "PPP", {
                locale: locale === "pt" ? pt : undefined,
              })
            ) : (
              <span>{t("utils.pickADate")}</span>
            )}

            <IconCalendar className="ml-auto h-5 w-5 cursor-pointer" />
          </div>
        </PopoverTrigger>

        {!disabled && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              defaultMonth={value}
              onSelect={onChange}
              disabled={(date) =>
                date < new Date("1900-01-01") ||
                (!!disableFuture && date > new Date())
              }
              initialFocus
            />
          </PopoverContent>
        )}
      </Popover>

      {helperText && (
        <p className={`mt-2 text-sm ${error && "text-red-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default DatePicker;

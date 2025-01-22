"use client";

import { FC, SetStateAction } from "react";
import { DateHeaderProps, View, Views } from "react-big-calendar";

interface IProps extends DateHeaderProps {
  setDate: (date: Date) => void;
  handleViewChange: (newView: SetStateAction<View>) => void;
  locale: string;
}

const DateHeader: FC<IProps> = ({
  label,
  setDate,
  date,
  handleViewChange,
  locale,
}) => {
  return (
    <div
      className="flex items-center justify-between"
      onClick={() => {
        setDate(date);
        handleViewChange(Views.DAY);
      }}
    >
      <p className="hidden md:block p-1 pl-2 text-sm overflow-hidden text-ellipsis text-nowrap max-w-28">
        R$ 1,999.00
      </p>

      <p className="p-1 rounded-full text-sm bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
        {label}
      </p>
    </div>
  );
};

export default DateHeader;

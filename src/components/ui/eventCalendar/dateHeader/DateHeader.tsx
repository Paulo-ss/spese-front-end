"use client";

import useViewport from "@/hooks/useViewport";
import { TDailyCashFlow } from "@/interfaces/cash-flow.interface";
import { FC, MutableRefObject, SetStateAction } from "react";
import { DateHeaderProps, View, Views } from "react-big-calendar";

interface IProps extends DateHeaderProps {
  setDate: (date: Date) => void;
  handleViewChange: (newView: SetStateAction<View>) => void;
  locale: string;
  areThereEventsForThisDate: boolean;
  groupRefs: MutableRefObject<Set<HTMLDivElement>>;
  dailyCashFlow: TDailyCashFlow;
}

const DateHeader: FC<IProps> = ({
  label,
  setDate,
  date,
  handleViewChange,
  areThereEventsForThisDate,
  locale,
  groupRefs,
  dailyCashFlow,
}) => {
  const { isMobile } = useViewport();

  const getDateBalance = () => {
    const dateMinusThreeHours = new Date(date);
    dateMinusThreeHours.setHours(date.getHours() - 3);

    return isNaN(
      Number(dailyCashFlow[dateMinusThreeHours.toISOString()]?.closingBalance)
    )
      ? undefined
      : Number(dailyCashFlow[dateMinusThreeHours.toISOString()].closingBalance);
  };

  const onDateClick = () => {
    if (!isMobile) {
      handleViewChange(Views.DAY);
      setDate(date);
    }

    if (isMobile) {
      const formattedDate = date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      groupRefs.current.forEach((element) => {
        if (element.firstChild?.textContent === formattedDate) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center md:flex-row md:justify-between"
      onClick={onDateClick}
    >
      <p
        className={`hidden md:block p-1 pl-2 text-sm overflow-hidden text-ellipsis text-nowrap max-w-28 ${
          Number(getDateBalance()) < 0 && "text-red-500"
        }`}
      >
        {getDateBalance()?.toLocaleString(locale, {
          style: "currency",
          currency: locale === "pt" ? "BRl" : "USD",
        })}
      </p>

      <p className="p-1 rounded-full text-sm bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
        {label}
      </p>

      {areThereEventsForThisDate && (
        <span className="block md:hidden w-1 h-1 rounded-full bg-zinc-800 dark:bg-white" />
      )}
    </div>
  );
};

export default DateHeader;

"use client";

import useViewport from "@/hooks/useViewport";
import { TDailyCashFlow } from "@/interfaces/cash-flow.interface";
import { formatDate } from "@/utils/dates/dateUtils";
import { formatCurrencyForLocale } from "@/utils/numbers/formatCurrencyForLocale";
import { Locale } from "@/types/locale.type";
import { FC, Fragment, MutableRefObject, SetStateAction } from "react";
import { DateHeaderProps, View, Views } from "react-big-calendar";

interface IProps extends DateHeaderProps {
  setDate: (date: Date) => void;
  handleViewChange: (newView: SetStateAction<View>) => void;
  locale: Locale;
  areThereEventsForThisDate: boolean;
  groupRefs: MutableRefObject<Set<HTMLDivElement>>;
  dailyCashFlow: TDailyCashFlow;
  isLoading: boolean;
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
  isLoading,
}) => {
  const { isMobile } = useViewport();

  const getDateBalance = () => {
    const dateInTimezone = formatDate(date, "YYYY-MM-DD");

    return isNaN(Number(dailyCashFlow[dateInTimezone]?.closingBalance))
      ? undefined
      : Number(dailyCashFlow[dateInTimezone]?.closingBalance);
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
      className="flex flex-col items-center justify-center md:flex-row md:justify-between cursor-pointer"
      onClick={onDateClick}
    >
      {isLoading ? (
        <div className="flex flex-grow h-2 p-2">
          <span className="animate-pulse h-2 w-full bg-zinc-100 dark:bg-zinc-600" />
        </div>
      ) : (
        <Fragment>
          <p
            className={`hidden md:block p-1 pl-2 text-sm overflow-hidden text-ellipsis text-nowrap max-w-28 ${
              Number(getDateBalance()) < 0 && "text-red-500"
            }`}
          >
            {getDateBalance() !== undefined &&
              formatCurrencyForLocale({
                number: getDateBalance()!,
                locale,
              })}
          </p>

          <p className="p-1 rounded-full text-sm bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
            {label}
          </p>

          {areThereEventsForThisDate && (
            <span className="block md:hidden w-1 h-1 rounded-full bg-purple-500 dark:bg-purple-800" />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default DateHeader;

"use client";

import { CalendarEventType } from "@/enums/calendar-event-type.enum";
import useViewport from "@/hooks/useViewport";
import { ICashFlowTransaction } from "@/interfaces/cash-flow.interface";
import { FC } from "react";
import { EventProps, View } from "react-big-calendar";

interface IProps extends EventProps {
  event: ICashFlowTransaction;
  view: View;
  locale: string;
  forceDisplay?: boolean;
  onClick?: (event: ICashFlowTransaction) => void;
}

const eventColor = {
  [CalendarEventType.INCOME]: "bg-green-300 dark:bg-primary-dark",
  [CalendarEventType.WAGE]: "bg-primary-mint dark:bg-primary-dark",
  [CalendarEventType.EXPENSE]: "bg-red-500",
  [CalendarEventType.INVOICE]: "bg-cyan-400",
};

const Event: FC<IProps> = ({ event, view, locale, forceDisplay, onClick }) => {
  const { isMobile } = useViewport();

  if (isMobile && !forceDisplay) {
    return null;
  }

  if (view === "agenda" || view === "day" || forceDisplay) {
    return (
      <div
        className="flex items-center gap-2 w-full p-2 border-b border-b-zinc-200 dark:border-b-zinc-700 cursor-pointer bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        onClick={() => {
          if (onClick) {
            onClick(event);
          }
        }}
      >
        <div className={`w-2 h-12 rounded-md ${eventColor[event.type]}`} />

        <div className="grow">
          <p className="font-bold text-ellipsis max-w-20 md:max-w-60 text-nowrap overflow-hidden">
            {event.title}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <p
            className={`${
              event.type === CalendarEventType.INCOME
                ? "text-emerald-400"
                : "text-red-500"
            }`}
          >
            {event.type === CalendarEventType.INCOME ? "+" : "-"}{" "}
            {Number(event.value).toLocaleString(locale, {
              style: "currency",
              currency: locale === "pt" ? "BRL" : "USD",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between px-1 text-sm rounded-md font-bold text-zinc-900 text-ellipsis text-nowrap overflow-hidden ${
        eventColor[event.type]
      }`}
    >
      <p className="overflow-hidden text-ellipsis text-nowrap max-w-28">
        {event.title}
      </p>

      <p className="hidden md:block">
        {Number(event.value).toLocaleString(locale, {
          style: "currency",
          currency: locale === "pt" ? "BRL" : "USD",
        })}
      </p>
    </div>
  );
};

export default Event;

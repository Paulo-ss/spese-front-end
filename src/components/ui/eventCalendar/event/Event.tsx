"use client";

import { CalendarEventType } from "@/enums/calendar-event-type.enum";
import { ICalendarEvent } from "@/interfaces/calendar-events.interface";
import { FC } from "react";
import { EventProps, View } from "react-big-calendar";

interface IProps extends EventProps {
  event: ICalendarEvent;
  view: View;
  locale: string;
}

const Event: FC<IProps> = ({ event, view, locale }) => {
  if (view === "agenda" || view === "day") {
    return (
      <div className="flex items-center gap-2 w-full p-2 border-b border-b-zinc-200 dark:border-b-zinc-700 cursor-pointer bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
        <div className={`w-2 h-16 rounded-md ${event.color}`} />

        <div className="grow">
          <p className="font-bold text-ellipsis max-w-20 md:max-w-60 text-nowrap overflow-hidden">
            {event.title}
          </p>

          <p
            className={`${
              event.type === CalendarEventType.EXPENSE
                ? "text-red-500"
                : "text-emerald-400"
            }`}
          >
            {event.type === CalendarEventType.EXPENSE ? "-" : "+"}{" "}
            {event.value.toLocaleString(locale, {
              style: "currency",
              currency: locale === "pt" ? "BRL" : "USD",
            })}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <p className="italic font-bold">saldo em conta</p>

          <p className={`${event.cashBalance < 0 ? "text-red-500" : ""}`}>
            {event.cashBalance.toLocaleString(locale, {
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
      className={`px-1 text-sm rounded-md font-bold text-zinc-900 text-ellipsis text-nowrap overflow-hidden ${event.color}`}
    >
      {event.title}
    </div>
  );
};

export default Event;

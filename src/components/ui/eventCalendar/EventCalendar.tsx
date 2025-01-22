"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { FC, SetStateAction, useState } from "react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/reactBigCalendarShadcn.css";
import { ICalendarEvent } from "@/interfaces/calendar-events.interface";
import { CalendarEventType } from "@/enums/calendar-event-type.enum";
import Event from "./event/Event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { useTranslations } from "next-intl";
import Toolbar from "./toolbar/Toolbar";
import MonthHeader from "./monthHeader/MonthHeader";
import DateHeader from "./dateHeader/DateHeader";
import IconButton from "../button/IconButton";
import { IconPlus } from "@tabler/icons-react";

interface IProps {
  locale: string;
}

const localizer = momentLocalizer(moment);

const EventCalendar: FC<IProps> = ({ locale }) => {
  const t = useTranslations();

  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null
  );

  const events: ICalendarEvent[] = [
    {
      title: "Salário",
      color: "bg-primary-mint dark:bg-primary-dark",
      type: CalendarEventType.WAGE,
      value: 1960,
      start: new Date(2025, 0, 17),
      end: new Date(2025, 0, 17),
      cashBalance: 2030,
    },
    {
      title: "Athos - Pagamento carro Ilhabela",
      color: "bg-primary-mint dark:bg-primary-dark",
      type: CalendarEventType.INCOME,
      value: 160.12,
      start: new Date(2025, 0, 17),
      end: new Date(2025, 0, 17),
      cashBalance: 2030,
    },
    {
      title: "salário",
      color: "bg-primary-mint dark:bg-primary-dark",
      type: CalendarEventType.WAGE,
      value: 1960,
      start: new Date(2025, 0, 17),
      end: new Date(2025, 0, 17),
      cashBalance: 2030,
    },
    {
      title: "fatura NuBank 4568",
      color: "bg-red-500",
      type: CalendarEventType.EXPENSE,
      value: 2400,
      start: new Date(2025, 1, 15),
      end: new Date(2025, 1, 15),
      cashBalance: -38.99,
    },
  ];

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: SetStateAction<View>) => {
    setView(newView);
  };

  return (
    <div className="w-full ">
      <Calendar
        defaultView="month"
        defaultDate={date}
        localizer={localizer}
        style={{ height: 600, width: "100%" }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        events={events}
        components={{
          event: (props) => <Event view={view} locale={locale} {...props} />,
          toolbar: (props) => <Toolbar locale={locale} {...props} />,
          month: {
            header: (props) => <MonthHeader locale={locale} {...props} />,
            dateHeader: (props) => (
              <DateHeader
                setDate={handleNavigate}
                handleViewChange={handleViewChange}
                locale={locale}
                {...props}
              />
            ),
          },
        }}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setIsDialogOpened(true);
        }}
        messages={{
          showMore: (count) => `+${count} ${t("utils.more")}`,
          noEventsInRange: t("cashFlow.noEvents"),
        }}
      />

      <Dialog
        open={isDialogOpened}
        onOpenChange={(isOpened) => setIsDialogOpened(isOpened)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>

            <DialogDescription>
              <div className="flex items-center gap-2 w-full bg-transparent">
                <div
                  className={`w-2 h-16 rounded-md ${selectedEvent?.color}`}
                />

                <div className="grow">
                  <p className="font-bold text-zinc-950 dark:text-zinc-50">
                    {t("cashFlow.DEFAULT")}
                  </p>

                  <p className="text-zinc-600 dark:text-zinc-200">
                    {selectedEvent?.start?.toLocaleDateString(locale)}
                  </p>

                  <p
                    className={`${
                      selectedEvent?.type === CalendarEventType.EXPENSE
                        ? "text-red-500"
                        : "text-emerald-400"
                    }`}
                  >
                    {selectedEvent?.type === CalendarEventType.EXPENSE
                      ? "-"
                      : "+"}{" "}
                    {selectedEvent?.value.toLocaleString(locale, {
                      style: "currency",
                      currency: locale === "pt" ? "BRL" : "USD",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <p className="italic font-bold text-zinc-950 dark:text-zinc-50">
                    saldo em conta
                  </p>

                  <p
                    className={`${
                      selectedEvent && selectedEvent?.cashBalance < 0
                        ? "text-red-500"
                        : "text-zinc-950 dark:text-zinc-50"
                    }`}
                  >
                    {selectedEvent?.cashBalance.toLocaleString(locale, {
                      style: "currency",
                      currency: locale === "pt" ? "BRL" : "USD",
                    })}
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;

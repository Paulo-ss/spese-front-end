"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import {
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/reactBigCalendarShadcn.css";
import {
  ICashFlowResponse,
  ICashFlowTransaction,
  TDailyCashFlow,
} from "@/interfaces/cash-flow.interface";
import MobileGroupedEvents from "./mobileGroupedEvents/MobileGroupedEvents";
import { fetchResource } from "@/services/fetchService";
import { useToast } from "@/hooks/use-toast";
import ListItemLoading from "../loading/ListItemLoading";
import useViewport from "@/hooks/useViewport";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../drawer";
import DayHeader from "./dayHeader/DayHeader";
import { formatDate } from "@/utils/dates/dateUtils";

interface IProps {
  initialDailyCashFlow: TDailyCashFlow;
  locale: string;
}

const localizer = momentLocalizer(moment);

const eventColor = {
  [CalendarEventType.INCOME]:
    "bg-teal-100 text-teal-700 dark:bg-teal-700 dark:text-zinc-50",
  [CalendarEventType.EXPENSE]:
    "bg-red-100 text-red-700 dark:bg-red-700 dark:text-zinc-50",
  [CalendarEventType.INVOICE]:
    "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-zinc-50",
};

const EventCalendar: FC<IProps> = ({ initialDailyCashFlow, locale }) => {
  const todayYearAndMonth = formatDate(new Date(), "YYYY-MM");
  const t = useTranslations();
  const { toast } = useToast();
  const { isMobile } = useViewport();

  const initialMonthEvents = Object.keys(initialDailyCashFlow).reduce(
    (events, key) => {
      const transactions = initialDailyCashFlow[key]?.transactions;
      if (transactions) {
        return [...events, ...transactions];
      }

      return events;
    },
    [] as ICashFlowTransaction[]
  );

  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCashFlow, setDailyCashFlow] = useState(initialDailyCashFlow);
  const [events, setEvents] =
    useState<ICashFlowTransaction[]>(initialMonthEvents);
  const [selectedEvent, setSelectedEvent] =
    useState<ICashFlowTransaction | null>(null);
  const [monthsCache, setMonthsCache] = useState(new Set([todayYearAndMonth]));

  const mobileEventsGroupsRefs = useRef<Set<HTMLDivElement>>(new Set());

  const monthEvents = events.filter(
    (event) =>
      event.start.getMonth() === date.getMonth() &&
      event.start.getFullYear() === date.getFullYear()
  );

  const handleNavigate = async (newDate: Date) => {
    setDate(newDate);
    const newMonth = formatDate(newDate, "YYYY-MM");

    if (!monthsCache.has(newMonth)) {
      try {
        setMonthsCache((state) => new Set(state).add(newMonth));
        setIsLoading(true);

        const currentMonth = formatDate(newDate, "YYYY-MM");

        const { data: cashFlow, error } =
          await fetchResource<ICashFlowResponse>({
            url: `/cash-flow/month/${currentMonth}`,
          });

        if (error) {
          throw new Error(
            Array.isArray(error.errorMessage)
              ? error.errorMessage[0]
              : error.errorMessage
          );
        }

        if (cashFlow) {
          for (const key in cashFlow.dailyCashFlow) {
            if (cashFlow.dailyCashFlow[key].transactions) {
              cashFlow.dailyCashFlow[key].transactions.forEach(
                (transaction, index) => {
                  const start = String(transaction.start).split(" ")[0];
                  const [startYear, startMonth, startDay] = start
                    .split("-")
                    .map(Number);
                  cashFlow.dailyCashFlow[key].transactions[index].start =
                    new Date(startYear, startMonth - 1, startDay);

                  const end = String(transaction.end).split(" ")[0];
                  const [endYear, endMonth, endDay] = end
                    .split("-")
                    .map(Number);
                  cashFlow.dailyCashFlow[key].transactions[index].end =
                    new Date(endYear, endMonth - 1, endDay);
                }
              );
            }
          }

          const monthEvents = Object.keys(cashFlow.dailyCashFlow).reduce(
            (events, key) => {
              const transactions = cashFlow.dailyCashFlow[key]?.transactions;
              if (transactions) {
                return [...events, ...transactions];
              }

              return events;
            },
            [] as ICashFlowTransaction[]
          );

          setDailyCashFlow((state) => ({
            ...state,
            ...cashFlow.dailyCashFlow,
          }));
          setEvents((state) => {
            const noDuplicatedEvents = [...state];

            for (const event of monthEvents) {
              if (!state.some((e) => e.entityId === event.entityId)) {
                noDuplicatedEvents.push(event);
              }
            }

            return noDuplicatedEvents;
          });
        }
      } catch (error) {
        if (error && error instanceof Error) {
          toast({
            title: t("utils.error"),
            description: error.message ?? t("utils.somethingWentWrong"),
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewChange = (newView: SetStateAction<View>) => {
    setView(newView);
  };

  useEffect(() => {
    if (isMobile && view === "day") {
      setView("month");
    }
  }, [isMobile, view]);

  return (
    <div className="w-full ">
      <Calendar
        defaultView="month"
        defaultDate={date}
        localizer={localizer}
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
                areThereEventsForThisDate={events.some(
                  ({ start }) =>
                    start.toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    }) ===
                    props.date.toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                )}
                groupRefs={mobileEventsGroupsRefs}
                dailyCashFlow={dailyCashFlow}
                isLoading={isLoading}
                {...props}
              />
            ),
          },
          day: {
            header: (props) => (
              <DayHeader
                dailyCashFlow={dailyCashFlow}
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

      {isLoading ? (
        <div className="flex flex-col md:hidden border border-zinc-200 dark:border-zinc-700 rounded-b-md bg-white dark:bg-zinc-950 max-h-[350px] overflow-auto">
          <ListItemLoading items={6} />
        </div>
      ) : (
        <Fragment>
          {monthEvents.length > 0 ? (
            <div className="flex flex-col md:hidden border border-zinc-200 dark:border-zinc-700 rounded-b-md bg-white dark:bg-zinc-950 max-h-[350px] overflow-auto">
              <MobileGroupedEvents
                groupedEvents={dailyCashFlow}
                locale={locale}
                localizer={localizer}
                view={view}
                groupRefs={mobileEventsGroupsRefs}
                onEventClick={(event: ICashFlowTransaction) => {
                  setSelectedEvent(event);
                  setIsDialogOpened(true);
                }}
                currentMonth={date.getMonth()}
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center md:hidden border text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 rounded-b-md bg-white dark:bg-zinc-950 h-[350px] overflow-auto">
              {t("cashFlow.noTransactionsForThisMonth")}
            </div>
          )}
        </Fragment>
      )}

      {selectedEvent && (
        <Fragment>
          {isMobile ? (
            <Drawer
              open={isDialogOpened}
              onOpenChange={(isOpened) => setIsDialogOpened(isOpened)}
            >
              <DrawerContent aria-describedby="" className="h-60">
                <DrawerHeader>
                  <DrawerTitle>{selectedEvent?.title}</DrawerTitle>
                </DrawerHeader>

                <div className="text-sm text-muted-foreground grow p-6 overflow-auto">
                  <div className="flex items-center gap-2 w-full bg-transparent">
                    <div
                      className={`w-2 h-16 rounded-md ${
                        eventColor[selectedEvent!.type]
                      }`}
                    />

                    <div className="grow">
                      <p className="font-bold text-zinc-950 dark:text-zinc-50">
                        {t("cashFlow.DEFAULT")}
                      </p>

                      <p className="text-zinc-600 dark:text-zinc-200">
                        {selectedEvent?.start.toLocaleDateString(locale)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <p
                        className={`${
                          selectedEvent!.type === CalendarEventType.INCOME
                            ? "text-emerald-400"
                            : "text-red-500"
                        }`}
                      >
                        {selectedEvent!.type === CalendarEventType.INCOME
                          ? "+"
                          : "-"}{" "}
                        {Number(selectedEvent!.price).toLocaleString(locale, {
                          style: "currency",
                          currency: locale === "pt" ? "BRL" : "USD",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
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
                        className={`w-2 h-16 rounded-md ${
                          eventColor[selectedEvent!.type]
                        }`}
                      />

                      <div className="grow">
                        <p className="font-bold text-zinc-950 dark:text-zinc-50">
                          {t("cashFlow.DEFAULT")}
                        </p>

                        <p className="text-zinc-600 dark:text-zinc-200">
                          {selectedEvent?.start.toLocaleDateString(locale)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <p
                          className={`${
                            selectedEvent!.type === CalendarEventType.INCOME
                              ? "text-emerald-400"
                              : "text-red-500"
                          }`}
                        >
                          {selectedEvent!.type === CalendarEventType.INCOME
                            ? "+"
                            : "-"}{" "}
                          {Number(selectedEvent!.price).toLocaleString(locale, {
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
          )}
        </Fragment>
      )}
    </div>
  );
};

export default EventCalendar;

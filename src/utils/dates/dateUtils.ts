import dayjs, { Dayjs } from "dayjs";
import { Locale } from "@/types/locale.type";
import { formatInTimeZone } from "date-fns-tz";
import { getUserSession } from "../session/getUserSession";

type DateTypes = Date | string | Dayjs;

export const getUserTimezone = async () => {
  const session = await getUserSession();

  return (
    session?.user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  );
};

export const getFirstDayOfMonth = (date: DateTypes): Dayjs => {
  return dayjs(date).startOf("month");
};

export const getLastDayOfMonth = (date: DateTypes): Dayjs => {
  return dayjs(date).endOf("month");
};

export const formatDate = (date: DateTypes, template: string): string => {
  return dayjs(date).format(template);
};

export const formatInUserTimezone = async ({
  date,
  formatString = "yyyy-MM-dd HH:mm:ss",
}: {
  date: DateTypes;
  formatString?: string;
}): Promise<string> => {
  const userTimezone = await getUserTimezone();

  return formatInTimeZone(dayjs(date).toDate(), userTimezone, formatString);
};

export const formatInClientTimezone = ({
  date,
  formatString = "yyyy-MM-dd HH:mm:ss",
}: {
  date: DateTypes;
  formatString?: string;
}): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return formatInTimeZone(dayjs(date).toDate(), timezone, formatString);
};

export const getDatesBetween = (
  startDate: DateTypes,
  endDate: DateTypes,
): Date[] => {
  const dates: Date[] = [];
  let currentDate = dayjs(startDate);

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    dates.push(currentDate.toDate());
    currentDate = currentDate.add(1, "day");
  }

  return dates;
};

export const getMonthCalendarDates = (date: Date) => {
  const firstDayOfTheMonth = getFirstDayOfMonth(date);
  const lastDayOfTheMonth = getLastDayOfMonth(date);

  const calendarDates: Date[] = [];

  let previousDay = firstDayOfTheMonth.subtract(1, "day");

  // 6 is Saturday
  while (previousDay.day() !== 6) {
    calendarDates.unshift(previousDay.toDate());
    previousDay = previousDay.subtract(1, "day");
  }

  calendarDates.push(...getDatesBetween(firstDayOfTheMonth, lastDayOfTheMonth));

  let nextDay = lastDayOfTheMonth.add(1, "day");

  // 0 is Sunday
  while (nextDay.day() !== 0) {
    calendarDates.push(nextDay.toDate());
    nextDay = nextDay.add(1, "day");
  }

  return calendarDates;
};

export const getToday = (): Dayjs => {
  return dayjs();
};

export const formatForLocale = ({
  date,
  locale,
  options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  },
}: {
  date: DateTypes;
  locale: Locale;
  options?: Intl.DateTimeFormatOptions;
}): string => {
  return dayjs(date).toDate().toLocaleDateString(locale, options);
};

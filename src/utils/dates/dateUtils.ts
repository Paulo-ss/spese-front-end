import dayjs, { Dayjs } from "dayjs";
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
  endDate: DateTypes
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
  const firstDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfTheMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );

  const calendarDates: Date[] = [];

  const previousDay = new Date(firstDayOfTheMonth);
  previousDay.setDate(previousDay.getDate() - 1);

  while (
    previousDay.toLocaleDateString("en-us", { weekday: "long" }) !== "Saturday"
  ) {
    calendarDates.unshift(new Date(previousDay));
    previousDay.setDate(previousDay.getDate() - 1);
  }

  calendarDates.push(...getDatesBetween(firstDayOfTheMonth, lastDayOfTheMonth));

  const nextDay = new Date(lastDayOfTheMonth);
  nextDay.setDate(nextDay.getDate() + 1);

  while (
    nextDay.toLocaleDateString("en-us", { weekday: "long" }) !== "Sunday"
  ) {
    calendarDates.push(new Date(nextDay));
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return calendarDates;
};

export const getToday = (): Dayjs => {
  return dayjs();
};

export const formatForLocale = (date: DateTypes, locale: string): string => {
  return dayjs(date).toDate().toLocaleDateString(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
};

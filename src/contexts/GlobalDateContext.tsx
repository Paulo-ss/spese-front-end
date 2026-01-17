"use client";

import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getToday,
} from "@/utils/dates/dateUtils";
import { ReactNode, createContext, useState } from "react";

interface IContextProps {
  date: Date;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  isLoading: boolean;
  updateDate: (date: Date) => void;
  updateFromDate: (date: Date | undefined) => void;
  updateToDate: (date: Date | undefined) => void;
  updateIsLoading: (isLoading: boolean) => void;
}

const today = getToday();
const firstDayOfTheMonth = getFirstDayOfMonth(today);
const lastDayOfTheMonth = getLastDayOfMonth(today);

export const GlobalDateContext = createContext({} as IContextProps);

export const GlobalDateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [date, setDate] = useState<Date>(today.toDate());
  const [fromDate, setFromDate] = useState<Date | undefined>(
    firstDayOfTheMonth.toDate()
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    lastDayOfTheMonth.toDate()
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateDate = (date: Date) => {
    setDate(date);
  };

  const updateToDate = (date: Date | undefined) => {
    setToDate(date);
  };

  const updateFromDate = (date: Date | undefined) => {
    setFromDate(date);
  };

  const updateIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  return (
    <GlobalDateContext.Provider
      value={{
        date,
        fromDate,
        toDate,
        isLoading,
        updateDate,
        updateFromDate,
        updateToDate,
        updateIsLoading,
      }}
    >
      {children}
    </GlobalDateContext.Provider>
  );
};

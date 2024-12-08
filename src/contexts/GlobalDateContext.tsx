"use client";

import { ReactNode, createContext, useState } from "react";

interface IContextProps {
  date: Date;
  toDate: Date;
  isLoading: boolean;
  updateDate: (date: Date) => void;
  updateToDate: (date: Date) => void;
  updateIsLoading: (isLoading: boolean) => void;
}

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

export const GlobalDateContext = createContext({} as IContextProps);

export const GlobalDateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [date, setDate] = useState<Date>(oneMonthAgo);
  const [toDate, setToDate] = useState<Date>(today);
  const [isLoading, setIsLoading] = useState(false);

  const updateDate = (date: Date) => {
    setDate(date);
  };

  const updateToDate = (date: Date) => {
    setToDate(date);
  };

  const updateIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  return (
    <GlobalDateContext.Provider
      value={{
        date,
        toDate,
        isLoading,
        updateDate,
        updateToDate,
        updateIsLoading,
      }}
    >
      {children}
    </GlobalDateContext.Provider>
  );
};

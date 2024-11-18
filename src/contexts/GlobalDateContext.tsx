"use client";

import { ReactNode, createContext, useState } from "react";

interface IContextProps {
  date: Date;
  isLoading: boolean;
  updateDate: (date: Date) => void;
  updateIsLoading: (isLoading: boolean) => void;
}

export const GlobalDateContext = createContext({} as IContextProps);

export const GlobalDateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const today = new Date();

  const [date, setDate] = useState<Date>(today);
  const [isLoading, setIsLoading] = useState(false);

  const updateDate = (date: Date) => {
    setDate(date);
  };

  const updateIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  return (
    <GlobalDateContext.Provider
      value={{ date, isLoading, updateDate, updateIsLoading }}
    >
      {children}
    </GlobalDateContext.Provider>
  );
};

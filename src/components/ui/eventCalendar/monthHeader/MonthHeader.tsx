"use client";

import { FC } from "react";
import { HeaderProps } from "react-big-calendar";
import { Locale } from "@/types/locale.type";

interface IProps extends HeaderProps {
  locale: Locale;
}

const MonthHeader: FC<IProps> = ({ date, locale }) => {
  return <div>{date.toLocaleDateString(locale, { weekday: "short" })}</div>;
};

export default MonthHeader;

"use client";

import { FC } from "react";
import { HeaderProps } from "react-big-calendar";

interface IProps extends HeaderProps {
  locale: string;
}

const MonthHeader: FC<IProps> = ({ date, locale }) => {
  return <div>{date.toLocaleDateString(locale, { weekday: "short" })}</div>;
};

export default MonthHeader;

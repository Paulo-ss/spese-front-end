"use client";

import { FC } from "react";
import EventCalendar from "../ui/eventCalendar/EventCalendar";

interface IProps {
  locale: string;
}

const CashFlow: FC<IProps> = ({ locale }) => {
  return <EventCalendar locale={locale} />;
};

export default CashFlow;

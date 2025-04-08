"use client";

import {
  ICashFlowTransaction,
  TDailyCashFlow,
} from "@/interfaces/cash-flow.interface";
import { FC, Fragment, MutableRefObject } from "react";
import Event from "../event/Event";
import { DateLocalizer, View } from "react-big-calendar";
import { useTranslations } from "next-intl";

interface IProps {
  groupedEvents: TDailyCashFlow;
  locale: string;
  localizer: DateLocalizer;
  view: View;
  groupRefs: MutableRefObject<Set<HTMLDivElement>>;
  onEventClick: (event: ICashFlowTransaction) => void;
  currentMonth: number;
}

const MobileGroupedEvents: FC<IProps> = ({
  groupedEvents,
  locale,
  localizer,
  view,
  groupRefs,
  onEventClick,
  currentMonth,
}) => {
  const t = useTranslations();

  return (
    <Fragment>
      {Object.keys(groupedEvents).map((key) => {
        const dailyCashFlow = groupedEvents[key];
        if (!dailyCashFlow.transactions) {
          return null;
        }

        const [year, month, day] = key.split("T")[0].split("-").map(Number);
        const date = new Date(year, month - 1, day);

        if (date.getMonth() !== currentMonth) {
          return null;
        }

        const formattedDate = date.toLocaleDateString(locale, {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        return (
          <Fragment key={key}>
            <div
              ref={(element) => {
                if (element) {
                  groupRefs.current.add(element);
                }
              }}
              className="flex items-center justify-between border-y border-y-zinc-200 dark:border-y-zinc-700 p-2"
            >
              <p>{formattedDate}</p>

              <div className="flex flex-col items-end">
                <p className="text-sm italic">{t("cashFlow.dayBalance")}</p>

                <p
                  className={`font-bold ${
                    Number(dailyCashFlow.closingBalance) < 0 && "text-red-500"
                  }`}
                >
                  {Number(dailyCashFlow.closingBalance).toLocaleString(locale, {
                    style: "currency",
                    currency: locale === "pt" ? "BRL" : "USD",
                  })}
                </p>
              </div>
            </div>

            {dailyCashFlow.transactions.map((event, index) => (
              <Event
                key={index}
                event={event}
                continuesAfter={false}
                continuesPrior={false}
                locale={locale}
                localizer={localizer}
                slotEnd={event.end!}
                slotStart={event.start!}
                title={event.title!.toString()}
                view={view}
                isAllDay={false}
                forceDisplay={true}
                onClick={onEventClick}
              />
            ))}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default MobileGroupedEvents;

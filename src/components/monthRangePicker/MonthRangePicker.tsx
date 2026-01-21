"use client";

import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import { FC, Fragment, useContext, useState } from "react";
import { Popover } from "../ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { IconCalendar, IconTrash } from "@tabler/icons-react";
import { Calendar } from "../ui/calendar";
import { useTranslations } from "next-intl";
import { Locale } from "@/types/locale.type";

interface IProps {
  locale: Locale;
}

const MonthRangePicker: FC<IProps> = ({ locale }) => {
  const { fromDate, toDate, updateFromDate, updateToDate } =
    useContext(GlobalDateContext);

  const [isCalendarOpened, setIsCalendarOpened] = useState(false);

  const t = useTranslations();

  const resetDates = () => {
    updateFromDate(undefined);
    updateToDate(undefined);
  };

  return (
    <div className="flex items-center z-50 w-full">
      <Popover open={isCalendarOpened} onOpenChange={setIsCalendarOpened}>
        <PopoverTrigger className="w-full">
          <div className="rounded-3xl p-3 bg-white dark:bg-zinc-950 shadow-md flex justify-between items-center gap-2 w-full">
            <div className="flex items-center gap-2">
              <IconCalendar />
            </div>

            {!fromDate || !toDate ? (
              <p className="text-sm md:text-base italic">
                {t("utils.selectThePeriod")}
              </p>
            ) : (
              <p className="text-sm md:text-base italic">
                {fromDate
                  .toLocaleDateString(locale, {
                    month: "short",
                    year: "numeric",
                    day: "2-digit",
                  })
                  .toLowerCase()}

                {toDate && (
                  <Fragment>
                    {" "}
                    /{" "}
                    {toDate
                      .toLocaleDateString(locale, {
                        month: "short",
                        year: "numeric",
                        day: "2-digit",
                      })
                      .toLowerCase()}
                  </Fragment>
                )}
              </p>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="z-50">
          <div className="flex flex-col p-2 bg-white dark:bg-zinc-950 mt-2 rounded-md shadow-md">
            <Calendar
              mode="range"
              defaultMonth={toDate ?? fromDate}
              selected={{ from: fromDate, to: toDate }}
              onSelect={(date) => {
                updateFromDate(date && date.from ? date.from : undefined);
                updateToDate(date && date.to ? date.to : undefined);
              }}
              className="bg-white dark:bg-zinc-950"
            />

            {fromDate && toDate && (
              <div
                className="rounded-full p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer self-end w-fit"
                onClick={resetDates}
              >
                <IconTrash />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthRangePicker;

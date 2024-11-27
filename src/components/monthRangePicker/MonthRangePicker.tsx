"use client";

import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import { FC, useContext, useState } from "react";
import { Popover } from "../ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { Calendar } from "../ui/calendar";

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

interface IProps {
  locale: string;
}

const MonthRangePicker: FC<IProps> = ({ locale }) => {
  const { date, toDate, updateDate, updateToDate } =
    useContext(GlobalDateContext);

  const [isCalendarOpened, setIsCalendarOpened] = useState(false);

  return (
    <div className="flex justify-center items-center z-50">
      <Popover open={isCalendarOpened} onOpenChange={setIsCalendarOpened}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <IconCalendar />

            <p>
              <b>
                {date
                  .toLocaleDateString(locale, {
                    month: "short",
                    year: "numeric",
                    day: "2-digit",
                  })
                  .toLowerCase()}
              </b>

              {toDate && (
                <b>
                  {" "}
                  /{" "}
                  {toDate
                    .toLocaleDateString(locale, {
                      month: "short",
                      year: "numeric",
                      day: "2-digit",
                    })
                    .toLowerCase()}
                </b>
              )}
            </p>

            {isCalendarOpened ? <IconChevronUp /> : <IconChevronDown />}
          </div>
        </PopoverTrigger>

        <PopoverContent className="z-50">
          <Calendar
            mode="range"
            defaultMonth={toDate ?? date}
            selected={{ from: date, to: toDate }}
            onSelect={(date) => {
              updateDate(date && date.from ? date.from : today);
              updateToDate(date && date.to ? date.to : tomorrow);

              if (date?.from && date.to) {
                setIsCalendarOpened(false);
              }
            }}
            className="bg-white dark:bg-zinc-900 rounded-md mt-2 shadow-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthRangePicker;

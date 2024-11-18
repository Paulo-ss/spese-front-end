"use client";

import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import { FC, useContext, useState } from "react";
import { Popover } from "../ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useTranslations } from "next-intl";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { endOfMonth, startOfMonth } from "date-fns";

const today = new Date();

interface IProps {
  locale: string;
}

const MonthPicker: FC<IProps> = ({ locale }) => {
  const { date, updateDate } = useContext(GlobalDateContext);
  const t = useTranslations();

  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<DateRange | undefined>(
    undefined
  );

  return (
    <div className="flex justify-center items-center z-40">
      <Popover open={isCalendarOpened} onOpenChange={setIsCalendarOpened}>
        <PopoverTrigger>
          <div className="flex items-center gap-2">
            <p>
              {t("summaryOf")}{" "}
              <b>
                {date
                  .toLocaleDateString(locale, {
                    month: "long",
                    year: "numeric",
                  })
                  .toLowerCase()}
              </b>
            </p>

            {isCalendarOpened ? <IconChevronUp /> : <IconChevronDown />}
          </div>
        </PopoverTrigger>

        <PopoverContent>
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={(date) => {
              updateDate(date ?? today);
              setIsCalendarOpened(false);
            }}
            modifiers={{
              selected: selectedMonth ?? { from: date, to: date },
              from: selectedMonth ? selectedMonth.from! : date,
              to: selectedMonth ? selectedMonth.to! : date,
            }}
            onDayClick={(day, modifiers) => {
              if (modifiers.selected) {
                setSelectedMonth(undefined);
                return;
              }

              setSelectedMonth({
                from: startOfMonth(day),
                to: endOfMonth(day),
              });
            }}
            className="bg-white dark:bg-zinc-900 rounded-md mt-2 shadow-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthPicker;

"use client";

import { ICalendarEvent } from "@/interfaces/calendar-events.interface";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { ToolbarProps } from "react-big-calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IProps extends ToolbarProps<ICalendarEvent> {
  locale: string;
}

const Toolbar: FC<IProps> = ({ date, onNavigate, onView, view, locale }) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col justify-center gap-4 items-center md:flex-row md:justify-between p-2 md:p-4 border-b border-zinc-300 dark:border-zinc-800">
      <div>
        {date.toLocaleDateString(locale, {
          day: view === "day" ? "2-digit" : undefined,
          month: "long",
          year: "numeric",
        })}
      </div>

      <div className="flex items-center gap-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-start w-full">
              <div className="py-1 px-2 flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-900 rounded-md">
                <p>{t(`cashFlow.${view}`)}</p>

                <IconChevronDown />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => onView("month")}>
                {t("cashFlow.month")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView("day")}>
                {t("cashFlow.day")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <IconChevronLeft
          onClick={() => onNavigate("PREV")}
          className="cursor-pointer"
        />

        <p
          onClick={() => onNavigate("TODAY")}
          className="py-1 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors rounded-md cursor-pointer"
        >
          {t("cashFlow.today")}
        </p>

        <IconChevronRight
          onClick={() => onNavigate("NEXT")}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Toolbar;

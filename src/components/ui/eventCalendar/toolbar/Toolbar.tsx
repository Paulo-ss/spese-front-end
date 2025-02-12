"use client";

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
import { ICashFlowTransaction } from "@/interfaces/cash-flow.interface";

interface IProps extends ToolbarProps<ICashFlowTransaction> {
  locale: string;
}

const today = new Date();

const Toolbar: FC<IProps> = ({ date, onNavigate, onView, view, locale }) => {
  const t = useTranslations();

  const isToday =
    view === "month"
      ? date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      : date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

  return (
    <div className="flex justify-between gap-4 items-center p-4 md:p-6 border-b border-zinc-300 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <p
          onClick={() => onNavigate("TODAY")}
          className={`py-1 px-2 transition-colors rounded-md cursor-pointer ${
            isToday
              ? "bg-emerald-200 dark:bg-emerald-700 hover:bg-emerald-400 dark:hover:bg-emerald-800"
              : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
          }`}
        >
          {t("cashFlow.today")}
        </p>

        <div className="hidden md:block">
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
      </div>

      <div className="flex items-center gap-2">
        <IconChevronLeft
          onClick={() => onNavigate("PREV")}
          className="cursor-pointer"
        />

        <p>
          {date.toLocaleDateString(locale, {
            day: view === "day" ? "2-digit" : undefined,
            month: "short",
            year: "numeric",
          })}
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

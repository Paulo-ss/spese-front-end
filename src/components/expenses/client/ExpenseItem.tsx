"use client";

import { ExpenseStatus } from "@/enums/expenses.enum";
import { IExpense } from "@/interfaces/expenses.interface";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC } from "react";

interface IProps {
  expense: IExpense;
  locale: string;
}

const categories = {
  "NÃO INFORMADO": {
    acronym: "N/A",
    borderColor: "border-gray-400 dark:border-gray-800",
    bgColor: "bg-gray-50 dark:bg-gray-400",
    textColor: "text-gray-400 dark:text-gray-800",
  },
  PERSONALIZADA: {
    acronym: "P",
    borderColor: "border-yellow-400 dark:border-yellow-800",
    bgColor: "bg-yellow-100 dark:bg-yellow-300",
    textColor: "text-yellow-400 dark:text-yellow-800",
  },
  SAÚDE: {
    acronym: "S",
    borderColor: "border-teal-400 dark:border-teal-800",
    bgColor: "bg-teal-50 dark:bg-teal-400",
    textColor: "text-teal-400 dark:text-teal-800",
  },
  LAZER: {
    acronym: "L",
    borderColor: "border-indigo-400 dark:border-indigo-800",
    bgColor: "bg-indigo-50 dark:bg-indigo-400",
    textColor: "text-indigo-400 dark:text-indigo-800",
  },
  ACADÊMICO: {
    acronym: "A",
    borderColor: "border-rose-400 dark:border-rose-800",
    bgColor: "bg-rose-50 dark:bg-rose-400",
    textColor: "text-rose-400 dark:text-rose-800",
  },
  DIVERSÃO: {
    acronym: "D",
    borderColor: "border-sky-400 dark:border-sky-800",
    bgColor: "bg-sky-50 dark:bg-sky-400",
    textColor: "text-sky-400 dark:text-sky-800",
  },
  COMIDA: {
    acronym: "C",
    borderColor: "border-orange-400 dark:border-orange-800",
    bgColor: "bg-orange-50 dark:bg-orange-400",
    textColor: "text-orange-400 dark:text-orange-800",
  },
  CASA: {
    acronym: "C",
    borderColor: "border-lime-400 dark:border-lime-800",
    bgColor: "bg-lime-50 dark:bg-lime-400",
    textColor: "text-lime-400 dark:text-lime-800",
  },
  ROUPAS: {
    acronym: "R",
    borderColor: "border-cyan-400 dark:border-cyan-800",
    bgColor: "bg-cyan-50 dark:bg-cyan-400",
    textColor: "text-cyan-400 dark:text-cyan-800",
  },
  PETS: {
    acronym: "P",
    borderColor: "border-red-400 dark:border-red-800",
    bgColor: "bg-red-50 dark:bg-red-400",
    textColor: "text-red-400 dark:text-red-800",
  },
  UBER: {
    acronym: "U",
    borderColor: "border-neutral-400 dark:border-neutral-800",
    bgColor: "bg-neutral-50 dark:bg-neutral-400",
    textColor: "text-neutral-400 dark:text-neutral-800",
  },
  INVESTIMENTO: {
    acronym: "I",
    borderColor: "border-green-400 dark:border-green-800",
    bgColor: "bg-green-50 dark:bg-green-400",
    textColor: "text-green-400 dark:text-green-800",
  },
  ACADEMIA: {
    acronym: "A",
    borderColor: "border-emerald-400 dark:border-emerald-800",
    bgColor: "bg-emerald-50 dark:bg-emerald-200",
    textColor: "text-emerald-400 dark:border-emerald-800",
  },
  ASSINATURA: {
    acronym: "A",
    borderColor: "border-purple-400 dark:border-purple-800",
    bgColor: "bg-purple-50 dark:bg-purple-200",
    textColor: "text-purple-400 dark:border-purple-800",
  },
};

type CategoryKey = keyof typeof categories;

const ExpenseItem: FC<IProps> = ({ expense, locale }) => {
  const t = useTranslations();

  const category = categories[expense.category as CategoryKey];

  return (
    <Link key={expense.id} href={`/expenses/${expense.id}`}>
      <div className="p-1 md:p-2 flex items-center gap-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors">
        <div className="flex items-center">
          <div
            className={`flex justify-center items-center p-1 w-8 h-8 md:p-2 md:w-12 md:h-12 rounded-full border ${category.borderColor} ${category.bgColor} ${category.textColor}`}
          >
            {expense.customCategory
              ? expense.customCategory.name.charAt(0).toUpperCase()
              : category.acronym}
          </div>
        </div>

        <div className="grow flex flex-col gap-2">
          <p className="text-base font-bold text-nowrap text-ellipsis overflow-hidden whitespace-nowrap max-w-24 md:max-w-fit">
            {expense.name}
          </p>

          <span
            className={`flex justify-center items-center rounded-2xl px-4 py-1 max-w-fit font-bold ${
              expense.status === ExpenseStatus.PAID
                ? "bg-emerald-100 dark:bg-emerald-500"
                : "bg-sky-200 dark:bg-sky-500"
            }`}
          >
            {t(`expenses.${expense.status}`)}
          </span>

          <p className="text-sm">{t(`expenses.${expense.expenseType}`)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {expense.installmentNumber && (
            <p className="text-sm font-bold">
              {t("expenses.installed")}, {expense.installmentNumber}x{" "}
              {t("expenses.of")} {expense.totalInstallments}
            </p>
          )}

          <p className="text-base md:text-lg font-bold">
            {Number(expense.price).toLocaleString(locale, {
              style: "currency",
              currency: locale === "pt" ? "BRL" : "USD",
            })}
          </p>
        </div>

        <IconChevronRight />
      </div>
    </Link>
  );
};

export default ExpenseItem;

"use client";

import { ExpenseStatus } from "@/enums/expenses.enum";
import { IExpense } from "@/interfaces/expenses.interface";
import {
  IconBarbell,
  IconBeach,
  IconBurger,
  IconCar,
  IconCash,
  IconContract,
  IconDeviceGamepad2,
  IconDog,
  IconForbid,
  IconHanger,
  IconHome,
  IconHospital,
  IconSchool,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC } from "react";

interface IProps {
  expense: IExpense;
  locale: string;
}

const categories = {
  "NÃO INFORMADO": {
    icon: <IconForbid />,
  },
  SAÚDE: {
    icon: <IconHospital />,
  },
  LAZER: {
    icon: <IconBeach />,
  },
  ACADÊMICO: {
    icon: <IconSchool />,
  },
  DIVERSÃO: {
    icon: <IconDeviceGamepad2 />,
  },
  COMIDA: {
    icon: <IconBurger />,
  },
  CASA: {
    icon: <IconHome />,
  },
  ROUPAS: {
    icon: <IconHanger />,
  },
  PETS: {
    icon: <IconDog />,
  },
  UBER: {
    icon: <IconCar />,
  },
  INVESTIMENTO: {
    icon: <IconCash />,
  },
  ACADEMIA: {
    icon: <IconBarbell />,
  },
  ASSINATURA: {
    icon: <IconContract />,
  },
};

type CategoryKey = keyof typeof categories;

const ExpenseItem: FC<IProps> = ({ expense, locale }) => {
  const t = useTranslations();

  const category = categories[expense.category as CategoryKey];

  return (
    <Link key={expense.id} href={`/expenses/${expense.id}`}>
      <div className="p-1 md:p-3 flex gap-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors">
        <div className="flex">
          <div
            className={`flex justify-center items-center p-1 w-8 h-8 md:p-2 md:w-12 md:h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-200`}
            style={{
              backgroundColor: expense.customCategory
                ? expense.customCategory.color
                : undefined,
            }}
          >
            {expense.customCategory
              ? expense.customCategory.name.charAt(0).toUpperCase()
              : category.icon}
          </div>
        </div>

        <div className="grow flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <p className="text-base font-bold text-nowrap text-ellipsis overflow-hidden whitespace-nowrap max-w-24 md:max-w-fit">
              {expense.name}
            </p>

            <span
              className={`flex rounded-full w-2 h-2 ${
                expense.status === ExpenseStatus.PAID
                  ? "bg-emerald-400 dark:bg-emerald-600"
                  : "bg-amber-500 dark:bg-amber-700"
              }`}
            />
          </div>

          <p className="text-base md:text-lg font-bold">
            {Number(expense.price).toLocaleString(locale, {
              style: "currency",
              currency: locale === "pt" ? "BRL" : "USD",
            })}
          </p>

          {expense.installmentNumber && (
            <p className="text-sm font-bold">
              {t("expenses.installed")}, {expense.installmentNumber}x{" "}
              {t("expenses.of")} {expense.totalInstallments}
            </p>
          )}

          <p className="text-sm">{t(`expenses.${expense.expenseType}`)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-sm">{expense.expenseDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default ExpenseItem;

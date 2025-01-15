"use client";

import ExpenseForm from "@/components/forms/expenses/ExpenseForm";
import { IAPIError } from "@/interfaces/api-error.interface";
import { IExpense } from "@/interfaces/expenses.interface";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { FC, Fragment, useState } from "react";

interface IProps {
  expense?: IExpense;
  error?: IAPIError;
  locale: string;
}

const ExpenseDetails: FC<IProps> = ({ expense, error, locale }) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const t = useTranslations();

  const updateIsEditing = (isEditing: boolean) => setIsEditing(isEditing);

  return (
    <Fragment>
      {isEditing ? (
        <ExpenseForm expense={expense} error={error} locale={locale} />
      ) : (
        <div className="w-full shadow-sm rounded-md bg-white dark:bg-zinc-900 dark:text-zinc-50">
          <div className="relative w-full rounded-t-md h-40 bg-zinc-100 dark:bg-zinc-900"></div>
        </div>
      )}
    </Fragment>
  );
};

export default ExpenseDetails;

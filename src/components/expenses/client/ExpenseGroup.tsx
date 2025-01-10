"use client";

import { IExpense } from "@/interfaces/expenses.interface";
import { FC } from "react";
import ExpenseItem from "./ExpenseItem";

interface IProps {
  expenses: IExpense[];
  groupName: string;
  locale: string;
}

const ExpenseGroup: FC<IProps> = ({ expenses, groupName, locale }) => {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-base flex text-right">
          {groupName} -{" "}
          {expenses
            .reduce((total, { price }) => total + Number(price), 0)
            .toLocaleString(locale, {
              style: "currency",
              currency: locale === "pt" ? "BRL" : "USD",
            })}
        </p>
      </div>

      {expenses?.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} locale={locale} />
      ))}
    </div>
  );
};

export default ExpenseGroup;

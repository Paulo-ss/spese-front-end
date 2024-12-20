"use client";

import { IExpense } from "@/interfaces/expenses.interface";
import { FC } from "react";
import ExpenseItem from "./ExpenseItem";
import { IconCalendar } from "@tabler/icons-react";

interface IProps {
  expenses: IExpense[];
  expensesDate: string;
  locale: string;
}

const ExpenseGroup: FC<IProps> = ({ expenses, expensesDate, locale }) => {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex items-center gap-2 mb-2">
        <IconCalendar />

        <p className="text-sm flex text-right ">{expensesDate}</p>
      </div>

      {expenses?.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} locale={locale} />
      ))}
    </div>
  );
};

export default ExpenseGroup;

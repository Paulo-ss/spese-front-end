"use client";

import { IExpense } from "@/interfaces/expenses.interface";
import { FC } from "react";
import ExpenseItem from "./ExpenseItem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IProps {
  expenses: IExpense[];
  groupName: string;
  locale: string;
  index: number;
}

const ExpenseGroup: FC<IProps> = ({ expenses, groupName, locale, index }) => {
  return (
    <AccordionItem value={String(index)}>
      <div className="flex flex-col mb-2">
        <AccordionTrigger className="flex items-center gap-2">
          <p className="text-base flex text-right">
            {groupName} -{" "}
            {expenses
              .reduce((total, { price }) => total + Number(price), 0)
              .toLocaleString(locale, {
                style: "currency",
                currency: locale === "pt" ? "BRL" : "USD",
              })}
          </p>
        </AccordionTrigger>

        <AccordionContent>
          {expenses?.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} locale={locale} />
          ))}
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};

export default ExpenseGroup;

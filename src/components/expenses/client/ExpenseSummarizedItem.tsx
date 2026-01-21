import payExpense from "@/app/actions/expenses/payExpense";
import Loader from "@/components/ui/loader/Loader";
import { ExpenseStatus } from "@/enums/expenses.enum";
import { useToast } from "@/hooks/use-toast";
import { IExpense } from "@/interfaces/expenses.interface";
import { theme } from "@/lib/theme/theme";
import {
  IconCheckbox,
  IconCircle,
  IconCircleCheckFilled,
  IconXboxX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { FC, Fragment, useState } from "react";
import { formatCurrencyForLocale } from "@/utils/numbers/formatCurrencyForLocale";
import { Locale } from "@/types/locale.type";

interface IProps {
  expense: IExpense;
  locale: Locale;
  index: number;
}

const ExpenseSummarizedItem: FC<IProps> = ({ expense, locale, index }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(expense.status);

  const t = useTranslations();
  const { toast } = useToast();

  const [year, month, day] = expense.expenseDate.split("-").map(Number);
  const formattedExpenseDate = new Date(
    year,
    month - 1,
    day,
  ).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
  });

  const handlePayExpense = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await payExpense(expense.id);

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        );
      }

      setStatus(ExpenseStatus.PAID);

      toast({
        title: t("utils.success"),
        description: data?.message,
        action: <IconCheckbox className="w-6 h-6" color="#86EFAC" />,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "erro",
          description: error.message,
          action: (
            <IconXboxX className="w-6 h-6" color={theme.colors.red[500]} />
          ),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full flex justify-between items-center gap-2 md:gap-4 text-sm md:text-base text-zinc-600 dark:text-zinc-300 ${
        index > 0 && "mt-2"
      }`}
    >
      <p>{formattedExpenseDate}</p>

      <p className="grow font-bold text-nowrap text-ellipsis overflow-hidden whitespace-nowrap">
        {expense.name}{" "}
        {expense.installmentNumber &&
          `${expense.installmentNumber} / ${expense.totalInstallments}`}
      </p>

      <p>
        {formatCurrencyForLocale({
          number: Number(expense.price),
          locale,
        })}
      </p>

      <span
        onClick={status === ExpenseStatus.PAID ? undefined : handlePayExpense}
        className={`${
          status === ExpenseStatus.PAID ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {isLoading ? (
          <Loader width="w-4" height="h-4" />
        ) : (
          <Fragment>
            {status === ExpenseStatus.PAID ? (
              <IconCircleCheckFilled color={theme.colors.emerald[500]} />
            ) : (
              <IconCircle />
            )}
          </Fragment>
        )}
      </span>
    </div>
  );
};

export default ExpenseSummarizedItem;

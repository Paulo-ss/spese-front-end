"use client";

import { IAPIError } from "@/interfaces/api-error.interface";
import {
  IconCashRegister,
  IconClipboardOff,
  IconPlus,
} from "@tabler/icons-react";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Card from "../ui/card/Card";
import IconButton from "../ui/button/IconButton";
import { useRouter } from "next/navigation";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { useTranslations } from "next-intl";
import IncomeItem from "./IncomeItem";
import { IIncome } from "@/interfaces/income.interface";
import { GlobalDateContext } from "@/contexts/GlobalDateContext";
import { fetchResource } from "@/services/fetchService";
import CardLoading from "../ui/loading/CardLoading";
import ListItemLoading from "../ui/loading/ListItemLoading";

interface IProps {
  initialIncomes?: IIncome[];
  error?: IAPIError;
  locale: string;
}

const Incomes: FC<IProps> = ({ initialIncomes, error, locale }) => {
  const { date, toDate, updateIsLoading } = useContext(GlobalDateContext);

  const [incomes, setIncomes] = useState(initialIncomes);
  const [errorMessage, setErrorMessage] = useState(
    error ? error.errorMessage : undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const t = useTranslations();

  const isFirstRender = useRef(true);

  const fetchIncomes = useCallback(async () => {
    try {
      updateIsLoading(true);
      setIsLoading(true);

      const [fromYear, fromMonth, fromDay] = date
        .toISOString()
        .split("T")[0]
        .split("-");
      const [toYear, toMonth, toDay] = toDate
        .toISOString()
        .split("T")[0]
        .split("-");

      const { data: incomes, error } = await fetchResource<IIncome[]>({
        url: "/income/filter",
        config: {
          options: {
            method: "POST",
            body: JSON.stringify({
              fromDate: `${fromMonth}-${fromDay}-${fromYear}`,
              toDate: `${toMonth}-${toDay}-${toYear}`,
            }),
            next: { tags: ["incomes"] },
          },
        },
      });

      if (incomes) {
        for (const income of incomes) {
          income.incomeMonth = new Date(income.incomeMonth).toLocaleDateString(
            locale,
            { weekday: "short", day: "2-digit", month: "short" }
          );
        }
      }

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setIncomes(incomes);
    } catch (error) {
      if (error && error instanceof Error) {
        setErrorMessage(error.message ?? t("utils.somethingWentWrong"));
      }
    } finally {
      updateIsLoading(false);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, toDate]);

  useEffect(() => {
    if (!isFirstRender.current) {
      fetchIncomes();
      return;
    }

    isFirstRender.current = false;
  }, [date, toDate, setIncomes, fetchIncomes]);

  if (isLoading) {
    return (
      <CardLoading>
        <ListItemLoading items={6} />
      </CardLoading>
    );
  }

  return (
    <Card
      title="incomes.yourIncomes"
      icon={<IconCashRegister />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            icon={<IconPlus />}
            onClick={() => router.push("/incomes/create")}
          />
        </div>
      }
    >
      {errorMessage ? (
        <ErrorDisplay errorMessage={errorMessage} />
      ) : (
        <Fragment>
          {incomes && incomes.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <IconClipboardOff width={40} height={40} />

              <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-50">
                {t("allClear")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1">
              {incomes?.map((income) => (
                <IncomeItem
                  key={income.id}
                  income={income}
                  locale={locale}
                  fetchIncomes={fetchIncomes}
                />
              ))}
            </div>
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default Incomes;

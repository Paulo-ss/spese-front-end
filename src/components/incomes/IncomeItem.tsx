"use client";

import { IIncome } from "@/interfaces/income.interface";
import { FC, useState } from "react";
import IconButton from "../ui/button/IconButton";
import { IconCheckbox, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next-nprogress-bar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Button from "../ui/button/Button";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import deleteIncome from "@/app/actions/incomes/deleteIncome";
import { theme } from "@/lib/theme/theme";
import { formatCurrencyForLocale } from "@/utils/numbers/formatCurrencyForLocale";
import { Locale } from "@/types/locale.type";

interface IProps {
  income: IIncome;
  locale: Locale;
  fetchIncomes: () => Promise<void>;
}

const IncomeItem: FC<IProps> = ({ locale, income, fetchIncomes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const { error } = await deleteIncome(income.id);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
          variant: "destructive",
        });

        return;
      }

      setIsDialogOpened(false);
      fetchIncomes();
      toast({
        title: t("utils.success"),
        description: t("incomes.deleted"),
        action: (
          <IconCheckbox className="w-6 h-6" color={theme.colors.emerald[400]} />
        ),
      });
    } catch (error) {
      if (error && error instanceof Error) {
        toast({
          title: t("utils.error"),
          description: error.message ?? t("utils.somethingWentWrong"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-1 p-2 flex items-center gap-3">
      <div className="flex items-center">
        <div
          className={`flex justify-center items-center p-2 w-12 h-12 rounded-full border border-emerald-400 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-300 text-emerald-400 dark:text-emerald-800`}
        >
          {income.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="grow flex flex-col">
        <p className="text-base">{income.name}</p>

        <p className="text-base md:text-2xl font-bold">
          {formatCurrencyForLocale({
            number: Number(income.value),
            locale,
          })}
        </p>

        <p className="text-sm flex text-right">{income.incomeMonth}</p>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          type="button"
          color="info"
          icon={<IconEdit />}
          onClick={() => router.push(`/incomes/${income.id}`)}
        />

        <Dialog
          open={isDialogOpened}
          onOpenChange={(isOpened) => setIsDialogOpened(isOpened)}
        >
          <DialogTrigger asChild>
            <IconButton type="button" color="error" icon={<IconTrash />} />
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {t("utils.confirmDelete", { name: t("incomes.DEFAULT") })}
              </DialogTitle>

              <DialogDescription>
                {t("utils.thisActionCantBeUndone")}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  color="neutral"
                  text={t("utils.cancel")}
                  trailing={<IconX />}
                />
              </DialogClose>

              <Button
                type="button"
                color="error"
                text={t("utils.delete")}
                onClick={onDelete}
                trailing={<IconTrash />}
                disabled={isLoading}
                isLoading={isLoading}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default IncomeItem;

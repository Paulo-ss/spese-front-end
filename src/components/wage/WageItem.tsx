"use client";

import { FC, useState } from "react";
import IconButton from "../ui/button/IconButton";
import { IconCheckbox, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next-nprogress-bar";
import { useTranslations } from "next-intl";
import { IWage } from "@/interfaces/wage.interface";
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
import { useToast } from "@/hooks/use-toast";
import Button from "../ui/button/Button";
import { theme } from "@/lib/theme/theme";
import deleteWage from "@/app/actions/wage/deleteWage";

interface IProps {
  wage: IWage;
  locale: string;
}

const WageItem: FC<IProps> = ({ wage, locale }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const { error } = await deleteWage(wage.id);

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
      toast({
        title: t("utils.success"),
        description: t("subscriptions.subscriptionDeleted"),
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
          {locale === "pt" ? "S" : "W"}
        </div>
      </div>

      <div className="grow flex flex-col">
        <p className="text-base md:text-2xl font-bold">
          {Number(wage.wage).toLocaleString(locale, {
            style: "currency",
            currency: locale === "pt" ? "BRL" : "USD",
          })}
        </p>

        <p className="text-base">
          {t("paymentDay")} - {wage.paymentDay}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          type="button"
          color="info"
          icon={<IconEdit />}
          onClick={() => router.push(`/wage/${wage.id}`)}
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
                {t("utils.confirmDelete", { name: t("wagePrice") })}
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

export default WageItem;

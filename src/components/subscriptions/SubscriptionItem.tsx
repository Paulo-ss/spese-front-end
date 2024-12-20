"use client";

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
import { theme } from "@/lib/theme/theme";
import { ISubscription } from "@/interfaces/subscription.interface";
import deleteSubscription from "@/app/actions/subscriptions/deleteSubscription";
import Image from "next/image";

interface IProps {
  subscription: ISubscription;
  locale: string;
  fetchSubscriptions: () => Promise<void>;
}

const SubscriptionItem: FC<IProps> = ({
  locale,
  subscription,
  fetchSubscriptions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const { error } = await deleteSubscription(subscription.id);

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
      fetchSubscriptions();
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
        <div className="w-10 h-10">
          <Image
            src={`/images/logos/${subscription.creditCard.bank}.png`}
            width={512}
            height={512}
            alt={`${subscription.creditCard.bank} logo`}
            className="overflow-hidden rounded-full"
          />
        </div>
      </div>

      <div className="grow flex flex-col">
        <p className="text-base">{subscription.name}</p>

        <p className="text-base md:text-2xl font-bold">
          {Number(subscription.price).toLocaleString(locale, {
            style: "currency",
            currency: locale === "pt" ? "BRL" : "USD",
          })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          type="button"
          color="info"
          icon={<IconEdit />}
          onClick={() => router.push(`/subscriptions/${subscription.id}`)}
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
                {t("utils.confirmDelete", { name: t("subscriptions.DEFAULT") })}
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

export default SubscriptionItem;

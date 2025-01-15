"use client";

import {
  ISubscription,
  ISubscriptionFiltersForm,
} from "@/interfaces/subscription.interface";
import { fetchResource } from "@/services/fetchService";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  IconChartCandle,
  IconRestore,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import IconButton from "../ui/button/IconButton";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import { Controller, useForm } from "react-hook-form";
import Label from "../ui/label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select/Select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Loader from "../ui/loader/Loader";
import saveFormState from "@/utils/saveFormState";
import getFormState from "@/utils/getFormState";

interface IProps {
  isLoading: boolean;
  updateLoading: (isLoading: boolean) => void;
  updateSubscriptions: (subscriptions: ISubscription[] | undefined) => void;
  updateErrorMessage: (errorMessage: string) => void;
}

const SubscriptionsFilters: FC<IProps> = ({
  isLoading,
  updateLoading,
  updateSubscriptions,
  updateErrorMessage,
}) => {
  const { control, getValues, reset, setValue } =
    useForm<ISubscriptionFiltersForm>();

  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);
  const [isLoadingCreditCards, setIsLoadingCreditCards] = useState(false);

  const t = useTranslations();
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      updateLoading(true);

      const creditCardId = getValues("creditCardId");

      const { data: subscriptions, error } = await fetchResource<
        ISubscription[]
      >({
        url: creditCardId
          ? `/credit-card/${creditCardId}/subscription`
          : "/credit-card/subscription/all/user",
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      updateSubscriptions(subscriptions);
    } catch (error) {
      if (error && error instanceof Error) {
        updateErrorMessage(error.message ?? t("utils.somethingWentWrong"));
      }
    } finally {
      updateLoading(false);
      setIsDrawerOpened(false);
    }
  };

  const fetchCreditCards = async () => {
    try {
      setIsLoadingCreditCards(true);

      const { data: creditCards, error } = await fetchResource<ICreditCard[]>({
        url: `/credit-card/all/user`,
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setCreditCards(creditCards!);
    } catch (error) {
      if (error && error instanceof Error) {
        toast({
          title: t("utils.error"),
          description: error.message ?? t("utils.somethingWentWrong"),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingCreditCards(false);
    }
  };

  useEffect(() => {
    const defaultFormValues =
      getFormState<ISubscriptionFiltersForm>("subsFormState");

    if (defaultFormValues) {
      setValue("creditCardId", defaultFormValues.creditCardId);
    }
  }, [setValue]);

  return (
    <Drawer
      open={isDrawerOpened}
      onOpenChange={(isOpened) => setIsDrawerOpened(isOpened)}
    >
      <DrawerTrigger asChild onClick={fetchCreditCards}>
        <IconButton type="button" color="neutral" icon={<IconChartCandle />} />
      </DrawerTrigger>

      <DrawerContent aria-describedby="">
        <DrawerHeader>
          <DrawerTitle>
            {t("utils.filter", { name: t("incomes.DEFAULT") })}
          </DrawerTitle>
        </DrawerHeader>

        <div className="text-sm text-muted-foreground grow p-6 overflow-auto">
          <Controller
            control={control}
            name="creditCardId"
            render={({ field: { value, onChange, name } }) => (
              <div className="w-full md:w-1/3">
                <div className="mb-2">
                  <Label
                    name={name}
                    label={t("subscriptions.selectACreditCard")}
                  />
                </div>

                <Select
                  onValueChange={onChange}
                  value={String(value)}
                  name={name}
                >
                  <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                    <SelectValue
                      placeholder={
                        !isLoadingCreditCards ? <Loader /> : undefined
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {creditCards.map((creditCard) => (
                      <SelectItem
                        key={creditCard.id}
                        value={String(creditCard.id)}
                      >
                        <div className="p-2 flex flex-row items-center gap-2">
                          <Image
                            src={`/images/logos/${creditCard.bank}.png`}
                            width={512}
                            height={512}
                            alt={`${value} logo`}
                            className="w-6 h-6 rounded-full"
                          />

                          <p>{creditCard.nickname}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>

        <DrawerFooter>
          <IconButton
            type="button"
            color="neutral"
            icon={<IconX />}
            onClick={() => {
              saveFormState<ISubscriptionFiltersForm>(
                getValues(),
                "subsFormState"
              );
              setIsDrawerOpened(false);
            }}
          />

          <IconButton
            type="button"
            color="info"
            onClick={() => {
              reset({ creditCardId: null });
            }}
            icon={<IconRestore />}
            disabled={isLoading}
            isLoading={isLoading}
          />

          <IconButton
            type="button"
            color="secondary"
            onClick={() => {
              saveFormState<ISubscriptionFiltersForm>(
                getValues(),
                "subsFormState"
              );
              fetchSubscriptions();
            }}
            icon={<IconSearch />}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SubscriptionsFilters;

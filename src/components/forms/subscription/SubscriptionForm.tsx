"use client";

import IconButton from "@/components/ui/button/IconButton";
import Card from "@/components/ui/card/Card";
import ErrorDisplay from "@/components/ui/errorDisplay/ErrorDisplay";
import Input from "@/components/ui/input/Input";
import { useToast } from "@/hooks/use-toast";
import { IAPIError } from "@/interfaces/api-error.interface";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconAlertTriangle,
  IconCheckbox,
  IconChevronLeft,
  IconEdit,
  IconPlus,
  IconSend2,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useForm } from "react-hook-form";
import { theme } from "@/lib/theme/theme";
import { fetchResource } from "@/services/fetchService";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import {
  ISubscription,
  ISubscriptionForm,
} from "@/interfaces/subscription.interface";
import Label from "@/components/ui/label/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/Select";
import Image from "next/image";
import saveSubscription from "@/app/actions/subscriptions/saveSubscription";
import editSubscription from "@/app/actions/subscriptions/editSubscription";
import { Banks } from "@/enums/banks.enum";

interface IProps {
  subscription?: ISubscription;
  error?: IAPIError;
}

const daysOfTheMonth = Array.from({ length: 31 }, (_, i) => i + 1);

const SubscriptionForm: FC<IProps> = ({ subscription, error }) => {
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<ISubscriptionForm>();

  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();

  const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ISubscriptionForm) => {
    try {
      setIsLoading(true);

      const formData = { ...data, creditCardId: Number(data.creditCardId) };

      const { error } = subscription
        ? await editSubscription(formData, subscription.id)
        : await saveSubscription(formData);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
          variant: "destructive",
          action: <IconAlertTriangle />,
        });

        return;
      }

      if (!subscription) {
        router.push("/subscriptions");

        return;
      }

      toast({
        title: t("utils.success"),
        description: t("subscriptions.successfullUpdate"),
        action: (
          <IconCheckbox className="w-6 h-6" color={theme.colors.emerald[400]} />
        ),
      });
    } catch (error) {
      if (error && error instanceof Error) {
        toast({
          title: t("utils.error"),
          description: error.message ?? t("utils.somethingWentWrong"),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditCards = useCallback(async () => {
    try {
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
    }
  }, [t, toast]);

  useEffect(() => {
    if (subscription) {
      setValue("name", subscription.name);
      setValue(
        "price",
        Number(
          formatDecimalNumber({ value: subscription.price, returnValue: true })
        )
      );
      setValue("creditCardId", subscription.creditCard.id);
      setValue("billingDay", Number(subscription.billingDay));
    }
  }, [subscription, setValue]);

  useEffect(() => {
    fetchCreditCards();
  }, [fetchCreditCards]);

  return (
    <Card
      title={
        subscription
          ? "subscriptions.editSubscription"
          : "subscriptions.createSubscription"
      }
      icon={subscription ? <IconEdit /> : <IconPlus />}
      action={
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            color="primary"
            variant="outlined"
            icon={<IconChevronLeft />}
            onClick={() => router.push("/subscriptions")}
          />
        </div>
      }
    >
      {error ? (
        <ErrorDisplay errorMessage={error.errorMessage} />
      ) : (
        <Fade duration={300} direction="up" triggerOnce cascade>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="col-span-1 w-full md:w-auto">
                <Controller
                  control={control}
                  name={`name`}
                  rules={{
                    required: {
                      value: true,
                      message: t("utils.requiredField"),
                    },
                  }}
                  render={({ field: { value, onChange, name } }) => (
                    <Input
                      type="text"
                      label={t("utils.name")}
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={errors && !!errors.name?.message}
                      helperText={errors?.name?.message}
                    />
                  )}
                />
              </div>

              <div className="col-span-1 w-full md:w-auto">
                <Controller
                  control={control}
                  name={`price`}
                  rules={{
                    required: {
                      value: true,
                      message: t("utils.requiredField"),
                    },
                  }}
                  render={({ field: { value, onChange, name } }) => (
                    <Input
                      type="text"
                      label={t("utils.price")}
                      name={name}
                      value={value}
                      onChange={onChange}
                      onBlur={() => {
                        formatDecimalNumber({
                          value,
                          setFieldValue: (formattedValue: number) => {
                            setValue("price", formattedValue);
                          },
                        });
                      }}
                      error={errors && !!errors.price?.message}
                      helperText={errors?.price?.message}
                    />
                  )}
                />
              </div>

              <div className="col-span-1 w-full md:w-auto">
                <Controller
                  control={control}
                  name={`creditCardId`}
                  defaultValue={
                    subscription ? subscription.creditCard.id : undefined
                  }
                  rules={{
                    required: {
                      value: true,
                      message: t("utils.requiredField"),
                    },
                  }}
                  render={({ field: { value, onChange, name } }) => (
                    <Fragment>
                      <div className="mb-2">
                        <Label name={name} label={t("creditCard.DEFAULT")} />
                      </div>

                      <Select
                        onValueChange={onChange}
                        value={String(value)}
                        name={name}
                        disabled={!!subscription}
                      >
                        <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                          <SelectValue />
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
                    </Fragment>
                  )}
                />
              </div>

              <div className="col-span-1 w-full md:w-auto">
                <Controller
                  control={control}
                  name="billingDay"
                  defaultValue={
                    subscription ? Number(subscription.billingDay) : 1
                  }
                  render={({ field: { value, onChange, name } }) => (
                    <Fragment>
                      <div className="mb-2">
                        <Label
                          name={name}
                          label={t("subscriptions.billingDay")}
                        />
                      </div>

                      <Select
                        onValueChange={onChange}
                        defaultValue={String(value)}
                        value={String(value)}
                        name={name}
                      >
                        <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                          <SelectValue placeholder={Banks.NUBANK} />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>
                              {t("utils.daysOfTheMonth")}
                            </SelectLabel>
                            {daysOfTheMonth.map((day) => (
                              <SelectItem key={day} value={String(day)}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Fragment>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <IconButton
                type="submit"
                icon={<IconSend2 />}
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>
          </form>
        </Fade>
      )}
    </Card>
  );
};

export default SubscriptionForm;

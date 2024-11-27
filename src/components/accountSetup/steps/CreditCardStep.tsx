"use client";

import saveMultipleCreditCards from "@/app/actions/creditCard/saveMultipleCreditCards";
import IconButton from "@/components/ui/button/IconButton";
import Input from "@/components/ui/input/Input";
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
import { Banks } from "@/enums/banks.enum";
import { useToast } from "@/hooks/use-toast";
import { ICreditCardsForm } from "@/interfaces/credit-card.interface";
import { banksSelectOptions } from "@/utils/bankAccounts/bankAccountsSelectOptions";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconChevronRight,
  IconCreditCard,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Slide } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useWizard } from "react-use-wizard";

const daysOfTheMonth = Array.from({ length: 31 }, (_, i) => i + 1);

const CreditCardStep = () => {
  const { nextStep } = useWizard();
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<ICreditCardsForm>({
    defaultValues: {
      creditCards: [
        {
          bank: Banks.NUBANK,
          closingDay: 1,
          dueDay: 1,
          limit: 0,
          nickname: "",
        },
      ],
    },
  });
  const { fields, append, remove, update } = useFieldArray<ICreditCardsForm>({
    control,
    name: "creditCards",
  });
  const t = useTranslations();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ICreditCardsForm) => {
    try {
      setIsLoading(true);

      const { error } = await saveMultipleCreditCards(data.creditCards);

      if (error) {
        toast({
          title: t("utils.error"),
          description: Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage,
        });
      }

      nextStep();
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
    <Slide duration={300} direction="right" triggerOnce>
      <p className="text-2xl mt-2 p-6">{t("creditCard.registerYourCards")}</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 flex flex-col gap-4 px-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col items-end border border-zinc-300 dark:border-zinc-600 rounded-md p-4 mt-2"
            >
              <div className="mb-2 w-full flex flex-row justify-between items-center">
                <IconCreditCard width={30} height={30} />

                <IconButton
                  type="button"
                  icon={<IconTrash width={25} height={25} />}
                  color="error"
                  onClick={() => remove(index)}
                />
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name={`creditCards.${index}.nickname`}
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: t("utils.requiredField"),
                      },
                    }}
                    render={({ field: { value, onChange, name } }) => (
                      <Input
                        type="text"
                        label={t("creditCard.nickname")}
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={
                          errors?.creditCards &&
                          !!errors?.creditCards[index]?.nickname?.message
                        }
                        helperText={
                          errors?.creditCards &&
                          errors?.creditCards[index]?.nickname?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name={`creditCards.${index}.bank`}
                    defaultValue={Banks.NUBANK}
                    render={({ field: { value, onChange, name } }) => (
                      <Fragment>
                        <div className="mb-2">
                          <Label
                            name={name}
                            label={t("bankAccount.selectTheBank")}
                          />
                        </div>

                        <Select
                          onValueChange={onChange}
                          defaultValue={value}
                          value={value}
                          name={name}
                        >
                          <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                            <SelectValue placeholder={Banks.NUBANK} />
                          </SelectTrigger>

                          <SelectContent>
                            {banksSelectOptions.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                <div className="p-2 flex rounded-md flex-row items-center gap-2">
                                  <div className="w-6 h-6">
                                    <Image
                                      src={`/images/logos/${value}.png`}
                                      width={512}
                                      height={512}
                                      alt={`${value} logo`}
                                    />
                                  </div>

                                  <p>{label}</p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Fragment>
                    )}
                  />
                </div>

                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name={`creditCards.${index}.limit`}
                    defaultValue={0}
                    rules={{
                      required: {
                        value: true,
                        message: t("utils.requiredField"),
                      },
                      validate: (value) => {
                        if (value <= 0) {
                          return t("commonValidations.mustBeGreaterThanZero");
                        }
                      },
                    }}
                    render={({ field: { value, onChange, name } }) => (
                      <Input
                        type="text"
                        label={t("creditCard.typeTheLimit")}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={() => {
                          formatDecimalNumber({
                            value,
                            setFieldValue: (formattedValue: number) => {
                              const formData = getValues("creditCards");
                              const creditCard = formData[index];

                              update(index, {
                                ...creditCard,
                                limit: formattedValue,
                              });
                            },
                          });
                        }}
                        error={
                          errors?.creditCards &&
                          !!errors?.creditCards[index]?.limit?.message
                        }
                        helperText={
                          errors?.creditCards &&
                          errors?.creditCards[index]?.limit?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name={`creditCards.${index}.closingDay`}
                    defaultValue={1}
                    render={({ field: { value, onChange, name } }) => (
                      <Fragment>
                        <div className="mb-2">
                          <Label
                            name={name}
                            label={t("creditCard.closingDay")}
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

                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name={`creditCards.${index}.dueDay`}
                    defaultValue={1}
                    render={({ field: { value, onChange, name } }) => (
                      <Fragment>
                        <div className="mb-2">
                          <Label name={name} label={t("creditCard.dueDay")} />
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
            </div>
          ))}
        </div>

        <div className="mt-2 p-6">
          <IconButton
            type="button"
            icon={<IconPlus width={30} height={30} />}
            color="primary"
            onClick={() =>
              append({
                bank: Banks.NUBANK,
                limit: 0,
                nickname: "",
                dueDay: 1,
                closingDay: 1,
              })
            }
          />
        </div>

        <div className="mt-2 p-6 flex gap-2 justify-end border-t border-zinc-300 dark:border-zinc-600">
          <IconButton
            type="submit"
            icon={<IconChevronRight width={30} height={30} />}
            color="primary"
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Slide>
  );
};

export default CreditCardStep;

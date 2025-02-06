import saveMultipleWages from "@/app/actions/wage/saveMultipleWages";
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
import { WageBusinessDay } from "@/enums/wage.enum";
import { useToast } from "@/hooks/use-toast";
import { IBankAccount } from "@/interfaces/bank-account.interface";
import { IWagesForm } from "@/interfaces/wage.interface";
import { fetchResource } from "@/services/fetchService";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import {
  IconCash,
  IconChevronRight,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Slide } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useWizard } from "react-use-wizard";

const daysOfTheMonth = Array.from({ length: 31 }, (_, i) => i + 1);

const WageStep = () => {
  const { nextStep } = useWizard();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IWagesForm>();
  const { fields, append, remove } = useFieldArray<IWagesForm>({
    control,
    name: "wages",
  });
  const { wages } = useWatch({ control });
  const t = useTranslations();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);

  const fetchBankAccounts = useCallback(async () => {
    try {
      const { data, error } = await fetchResource<IBankAccount[]>({
        url: "/bank-account/all/user",
      });

      if (error) {
        throw new Error(
          Array.isArray(error.errorMessage)
            ? error.errorMessage[0]
            : error.errorMessage
        );
      }

      setBankAccounts(data!);
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

  const onSubmit = async (data: IWagesForm) => {
    try {
      setIsLoading(true);

      const { error } = await saveMultipleWages(data.wages);

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

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  return (
    <Slide duration={300} direction="right" triggerOnce>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 flex flex-col gap-4 px-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col items-end border border-zinc-300 dark:border-zinc-600 rounded-md p-4 mt-2"
            >
              <div className="mb-2 w-full flex flex-row justify-between items-center">
                <IconCash />

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
                    name={`wages.${index}.wage`}
                    defaultValue={0}
                    rules={{
                      required: {
                        value: true,
                        message: t("utils.requiredField"),
                      },
                      validate: (value) => {
                        if (value && value <= 0) {
                          return t("commonValidations.mustBeGreaterThanZero");
                        }
                      },
                    }}
                    render={({ field: { value, onChange, name } }) => (
                      <Input
                        type="text"
                        label={t("typeYourWage")}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={() => {
                          if (value) {
                            formatDecimalNumber({
                              value,
                              setFieldValue: (formattedValue: number) => {
                                setValue(`wages.${index}.wage`, formattedValue);
                              },
                            });
                          }
                        }}
                        error={
                          errors?.wages && !!errors?.wages[index]?.wage?.message
                        }
                        helperText={
                          errors?.wages && errors?.wages[index]?.wage?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="col-span-12 sm:col-span-6 md:col-span-4">
                  <Controller
                    control={control}
                    name={`wages.${index}.paymentDay`}
                    defaultValue={1}
                    render={({ field: { value, onChange, name } }) => (
                      <Fragment>
                        <div className="mb-2">
                          <Label name={name} label={t("paymentDay")} />
                        </div>

                        <Select
                          onValueChange={onChange}
                          defaultValue={String(value)}
                          value={String(value)}
                          name={name}
                        >
                          <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                            <SelectValue />
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
                    name={`wages.${index}.businessDay`}
                    defaultValue={WageBusinessDay.BEFORE}
                    render={({ field: { value, onChange, name } }) => (
                      <Fragment>
                        <div className="mb-2">
                          <Label name={name} label={t("paymentDay")} />
                        </div>

                        <Select
                          onValueChange={onChange}
                          defaultValue={String(value)}
                          value={String(value)}
                          name={name}
                        >
                          <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{t("infoBusinessDay")}</SelectLabel>
                              <SelectItem
                                key={WageBusinessDay.BEFORE}
                                value={WageBusinessDay.BEFORE}
                              >
                                {t(`${WageBusinessDay.BEFORE.toLowerCase()}`)}
                              </SelectItem>
                              <SelectItem
                                key={WageBusinessDay.AFTER}
                                value={WageBusinessDay.AFTER}
                              >
                                {t(`${WageBusinessDay.AFTER.toLowerCase()}`)}
                              </SelectItem>
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
                    name={`wages.${index}.bankAccountId`}
                    render={({ field: { value, onChange, name } }) => (
                      <Fragment>
                        <div className="mb-2">
                          <Label
                            name={name}
                            label={t("expenses.bankAccount")}
                          />
                        </div>

                        <Select
                          onValueChange={onChange}
                          value={String(value)}
                          name={name}
                        >
                          <div className="flex justify-between items-center w-full gap-2">
                            <SelectTrigger className="py-[22px] px-2 dark:bg-zinc-900 dark:border-zinc-500">
                              <SelectValue></SelectValue>
                            </SelectTrigger>

                            {wages && wages[index].bankAccountId && (
                              <div
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                onClick={() =>
                                  setValue(
                                    `wages.${index}.bankAccountId`,
                                    undefined
                                  )
                                }
                              >
                                <IconX className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <SelectContent>
                            {bankAccounts.map((bankAccount) => (
                              <SelectItem
                                key={bankAccount.id}
                                value={String(bankAccount.id)}
                              >
                                <div className="p-2 flex rounded-md flex-row items-center gap-2">
                                  <Image
                                    src={`/images/logos/${bankAccount.bank}.png`}
                                    width={512}
                                    height={512}
                                    alt={`${bankAccount.bank} logo`}
                                    className="w-6 h-6 rounded-full"
                                  />

                                  <p>{bankAccount.bank}</p>
                                </div>
                              </SelectItem>
                            ))}
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
            icon={<IconPlus />}
            color="primary"
            onClick={() =>
              append({
                wage: 0,
                paymentDay: 1,
                bankAccountId: undefined,
                businessDay: WageBusinessDay.BEFORE,
              })
            }
          />
        </div>

        <div className="mt-2 p-6 flex gap-2 justify-end border-t border-zinc-300 dark:border-zinc-600">
          <IconButton
            type="submit"
            icon={<IconChevronRight />}
            color="primary"
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Slide>
  );
};

export default WageStep;

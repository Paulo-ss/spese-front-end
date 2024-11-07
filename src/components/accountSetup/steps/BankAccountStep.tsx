import saveMultipleBankAccounts from "@/app/actions/bankAccount/saveMultipleBankAccounts";
import IconButton from "@/components/ui/button/IconButton";
import Input from "@/components/ui/input/Input";
import Select from "@/components/ui/select/Select";
import { Banks } from "@/enums/banks.enum";
import { IBankAccountFieldsArray } from "@/interfaces/bank-account.interface";
import { formatDecimalNumber } from "@/utils/formatDecimalNumber";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Slide } from "react-awesome-reveal";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useWizard } from "react-use-wizard";

const banksSelectOptions = [
  {
    value: Banks.NUBANK,
    label: Banks.NUBANK,
  },
  {
    value: Banks.ITAU,
    label: Banks.ITAU,
  },
  {
    value: Banks.INTER,
    label: Banks.INTER,
  },
  {
    value: Banks.BRADESCO,
    label: Banks.NUBANK,
  },
];

type BankSelectOption = (typeof banksSelectOptions)[0];

const BankAccountStep = () => {
  const { handleStep } = useWizard();
  const {
    control,
    formState: { errors },
    getValues,
  } = useForm<IBankAccountFieldsArray>({
    defaultValues: {
      bankAccounts: [{ bank: Banks.NUBANK, currentBalance: 0 }],
    },
  });
  const { fields, append, remove, update } =
    useFieldArray<IBankAccountFieldsArray>({
      control,
      name: "bankAccounts",
    });
  const t = useTranslations();

  const getBankValue = (index: number): Banks => {
    const options = getValues(`bankAccounts`);
    const bank = options[index].bank as any;
    let bankValue = null;

    if (Object.hasOwn(bank, "value")) {
      bankValue = bank.value as Banks;
    } else {
      bankValue = bank as Banks;
    }

    return bankValue;
  };

  const handleNextPage = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = getValues("bankAccounts");

        const bankAccounts = formData.map(({ currentBalance }, index) => {
          const bankValue = getBankValue(index);

          return {
            bank: bankValue,
            currentBalance,
          };
        });

        const { data: successMessage, error } = await saveMultipleBankAccounts(
          bankAccounts
        );

        if (error) {
          reject({
            message: Array.isArray(error.errorMessage)
              ? error.errorMessage[0]
              : error.errorMessage,
          });
        }

        resolve(successMessage!);
        reject();
      } catch (error: any) {
        reject({
          message: error.message ?? t("utils.somethingWentWrong"),
        });
      }
    });
  };

  handleStep(async () => {
    await handleNextPage();
  });

  return (
    <Slide duration={300} direction="right" triggerOnce>
      <p className="text-2xl mt-2">
        {t("bankAccount.registerYourBankAccount")}
      </p>

      <div className="mt-2 flex flex-col gap-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4"
          >
            <div className="grow w-full md:w-auto">
              <Controller
                control={control}
                name={`bankAccounts.${index}.bank`}
                defaultValue={Banks.NUBANK}
                render={({ field: { value, onChange } }) => (
                  <Select<BankSelectOption>
                    value={
                      banksSelectOptions.find((bank) => bank.value === value)!
                    }
                    label={t("bankAccount.selectTheBank")}
                    name="bankSelect"
                    onChange={onChange}
                    options={banksSelectOptions}
                    formatOptionLabel={({ value }) => (
                      <div className="p-2 flex rounded-md flex-row items-center gap-2">
                        <div className="w-6 h-6">
                          <Image
                            src={`/images/logos/${value}.png`}
                            width={512}
                            height={512}
                            alt={`${value} logo`}
                          />
                        </div>

                        <p>{value}</p>
                      </div>
                    )}
                  />
                )}
              />
            </div>

            <div className="grow w-full md:w-auto">
              <Controller
                control={control}
                name={`bankAccounts.${index}.currentBalance`}
                render={({ field: { value, onChange, name } }) => (
                  <Input
                    type="text"
                    label={t("bankAccount.typeTheCurrentBalance")}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={() => {
                      formatDecimalNumber({
                        value,
                        setFieldValue: (formattedValue: number) => {
                          const bankValue = getBankValue(index);

                          update(index, {
                            bank: bankValue,
                            currentBalance: formattedValue,
                          });
                        },
                      });
                    }}
                    error={
                      errors?.bankAccounts &&
                      !!errors?.bankAccounts[index]?.currentBalance?.message
                    }
                    helperText={
                      errors?.bankAccounts &&
                      errors?.bankAccounts[index]?.currentBalance?.message
                    }
                  />
                )}
              />
            </div>

            <div className="grow w-full md:grow-0 md:w-fit">
              <IconButton
                type="button"
                icon={<IconTrash width={30} height={30} />}
                color="error"
                fullWidth
                onClick={() => remove(index)}
              />
            </div>
          </div>
        ))}

        <div className="mb-6 mt-4">
          <IconButton
            type="button"
            icon={<IconPlus width={30} height={30} />}
            color="primary"
            onClick={() => append({ bank: Banks.NUBANK, currentBalance: 0 })}
          />
        </div>
      </div>
    </Slide>
  );
};

export default BankAccountStep;

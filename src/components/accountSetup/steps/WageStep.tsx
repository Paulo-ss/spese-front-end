import saveWage from "@/app/actions/wage/saveWage";
import Input from "@/components/ui/input/Input";
import { IWage } from "@/interfaces/wage.interface";
import { useTranslations } from "next-intl";
import { Slide } from "react-awesome-reveal";
import { Controller, useForm } from "react-hook-form";
import { useWizard } from "react-use-wizard";

const WageStep = () => {
  const { handleStep } = useWizard();
  const {
    control,
    formState: { errors },
    getValues,
    setError,
  } = useForm<{ wage: string }>();
  const t = useTranslations();

  const handleNextPage = async () => {
    return new Promise<IWage>(async (resolve, reject) => {
      try {
        const wage = getValues("wage");
        if (isNaN(Number(wage.replace(",", "."))) || wage.length === 0) {
          setError("wage", {
            message: t("wageValidations.typeAValidWage"),
          });
          reject({ message: t("wageValidations.typeAValidWage") });
        }

        const { data, error } = await saveWage(wage.replace(",", "."));

        if (error) {
          reject({
            message: Array.isArray(error.errorMessage)
              ? error.errorMessage[0]
              : error.errorMessage,
          });
        }

        resolve(data!);
      } catch (error: any) {
        reject({
          message: error.message ?? t("errorWhileSavingWage"),
        });
      }
    });
  };

  handleStep(async () => {
    await handleNextPage();
  });

  return (
    <Slide duration={300} direction="right">
      <div className="flex flex-col py-4">
        <Controller
          control={control}
          name="wage"
          defaultValue="0"
          render={({ field }) => (
            <Input
              type="text"
              label={t("typeYourWage")}
              {...field}
              error={!!errors.wage?.message}
              helperText={errors.wage?.message}
            />
          )}
        />
      </div>
    </Slide>
  );
};

export default WageStep;

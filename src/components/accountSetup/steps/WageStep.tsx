import saveWage from "@/app/actions/wage/saveWage";
import IconButton from "@/components/ui/button/IconButton";
import Input from "@/components/ui/input/Input";
import { useToast } from "@/hooks/use-toast";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Slide } from "react-awesome-reveal";
import { Controller, useForm } from "react-hook-form";
import { useWizard } from "react-use-wizard";

const WageStep = () => {
  const { nextStep } = useWizard();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<{ wage: string }>();

  const t = useTranslations();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: { wage: string }) => {
    try {
      setIsLoading(true);

      const { error } = await saveWage(data.wage.replace(",", "."));

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col p-6 w-full sm:max-w-64">
          <Controller
            control={control}
            name="wage"
            defaultValue="0"
            rules={{
              validate: (wage) => {
                if (
                  isNaN(Number(wage.replace(",", "."))) ||
                  wage.length === 0 ||
                  Number(wage) === 0
                ) {
                  return t("wageValidations.typeAValidWage");
                }
              },
            }}
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

export default WageStep;

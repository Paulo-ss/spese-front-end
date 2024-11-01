import saveWage from "@/app/actions/wage/saveWage";
import Input from "@/components/ui/input/Input";
import { IWage } from "@/interfaces/wage.interface";
import { useSession } from "next-auth/react";
import { FC, MutableRefObject, useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import { Controller, useForm } from "react-hook-form";
import { useWizard } from "react-use-wizard";

interface IProps {
  previousStepRef: MutableRefObject<number>;
}

const WageStep: FC<IProps> = ({ previousStepRef }) => {
  const { data: session, update } = useSession();
  const { activeStep, handleStep } = useWizard();
  const {
    control,
    formState: { errors },
    getValues,
    setError,
  } = useForm<{ wage: string }>();

  const handleNextPage = async () => {
    return new Promise<IWage>(async (resolve, reject) => {
      try {
        const wage = getValues("wage");
        if (isNaN(Number(wage.replace(",", "."))) || wage.length === 0) {
          setError("wage", {
            message: "digite um salário válido (Ex: 11,99)",
          });
          reject({ message: "digite um salário válido (apenas números)" });
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
        update({ ...session?.user, accountSetup: true });
      } catch (error: any) {
        reject({
          message: error.message ?? "erro ao salvar o salário",
        });
      }
    });
  };

  handleStep(async () => {
    await handleNextPage();
  });

  useEffect(() => {
    return () => {
      previousStepRef.current = activeStep;
    };
  }, [activeStep, previousStepRef]);

  return (
    <Slide
      duration={300}
      direction={activeStep - previousStepRef.current < 0 ? "left" : "right"}
    >
      <div className="flex flex-col py-4">
        <Controller
          control={control}
          name="wage"
          render={({ field }) => (
            <Input
              type="text"
              label="defina o seu salário"
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

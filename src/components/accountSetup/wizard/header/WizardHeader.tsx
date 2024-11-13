import IconButton from "@/components/ui/button/IconButton";
import Divider from "@/components/ui/divider/Divider";
import {
  IconBuildingBank,
  IconCash,
  IconCategory,
  IconCreditCard,
  IconPlayerTrackNext,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useWizard } from "react-use-wizard";

const WizardHeader = () => {
  const { isFirstStep, isLastStep, activeStep, nextStep } = useWizard();
  const t = useTranslations();

  return (
    <div className="p-6 border-b border-zinc-300 dark:border-zinc-600">
      <div className="w-full flex justify-between items-center gap-4 sm:gap-6 ">
        <h3 className="text-3xl font-bold">{t("finishYourAccount")}</h3>

        {!isFirstStep && !isLastStep && (
          <IconButton
            type="button"
            onClick={() => nextStep()}
            icon={<IconPlayerTrackNext width={30} height={30} />}
            color="info"
          />
        )}
      </div>

      <div className="flex justify-around items-center gap-2 mt-6">
        <div
          className={`p-2 flex justify-center items-center rounded-full dark:text-zinc-50 w-12 h-12 ${
            isFirstStep
              ? "bg-primary-light dark:bg-primary-dark"
              : "bg-zinc-100 dark:bg-zinc-950"
          } transition-colors duration-300`}
        >
          <IconCash />
        </div>

        <Divider />

        <div
          className={`p-2 flex justify-center items-center rounded-full dark:text-zinc-50 w-12 h-12 ${
            activeStep === 1
              ? "bg-primary-light dark:bg-primary-dark"
              : "bg-zinc-100 dark:bg-zinc-950"
          } transition-colors duration-300`}
        >
          <IconBuildingBank />
        </div>

        <Divider />

        <div
          className={`p-2 flex justify-center items-center rounded-full dark:text-zinc-50 w-12 h-12 ${
            activeStep === 2
              ? "bg-primary-light dark:bg-primary-dark"
              : "bg-zinc-100 dark:bg-zinc-950"
          } transition-colors duration-300`}
        >
          <IconCreditCard />
        </div>

        <Divider />

        <div
          className={`p-2 flex justify-center items-center rounded-full dark:text-zinc-50 w-12 h-12 ${
            isLastStep
              ? "bg-primary-light dark:bg-primary-dark"
              : "bg-zinc-100 dark:bg-zinc-950"
          } transition-colors duration-300`}
        >
          <IconCategory />
        </div>
      </div>
    </div>
  );
};

export default WizardHeader;

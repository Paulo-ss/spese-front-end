import Button from "@/components/ui/button/Button";
import IconButton from "@/components/ui/button/IconButton";
import { IconPlayerTrackNext } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useWizard } from "react-use-wizard";

const WizardHeader = () => {
  const { isFirstStep, isLastStep, nextStep } = useWizard();
  const t = useTranslations();

  return (
    <div className="w-full flex justify-between items-center gap-4 sm:gap-6">
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
  );
};

export default WizardHeader;

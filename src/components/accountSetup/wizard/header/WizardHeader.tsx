import Button from "@/components/ui/button/Button";
import { IconPlayerTrackNext } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useWizard } from "react-use-wizard";

const WizardHeader = () => {
  const { isFirstStep, isLastStep, nextStep } = useWizard();
  const t = useTranslations();

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
      <h3 className="text-3xl font-bold">{t("finishYourAccount")}</h3>

      {!isFirstStep && !isLastStep && (
        <Button
          type="button"
          color="info"
          text={t("utils.skip")}
          variant="outlined"
          trailing={<IconPlayerTrackNext />}
          onClick={() => nextStep()}
          small
        />
      )}
    </div>
  );
};

export default WizardHeader;

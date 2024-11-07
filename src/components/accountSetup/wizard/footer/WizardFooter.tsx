import IconButton from "@/components/ui/button/IconButton";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { useWizard } from "react-use-wizard";

const WizardFooter = () => {
  const { nextStep, isLastStep, isLoading } = useWizard();

  return (
    <div className="mt-2 pb-6 flex gap-2 justify-end">
      {isLastStep ? (
        <IconButton
          type="button"
          onClick={() => nextStep()}
          icon={<IconCheck width={30} height={30} />}
          color="primary"
          disabled={isLoading}
          isLoading={isLoading}
        />
      ) : (
        <IconButton
          type="button"
          onClick={() => nextStep()}
          icon={<IconChevronRight width={30} height={30} />}
          color="primary"
          disabled={isLoading}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default WizardFooter;

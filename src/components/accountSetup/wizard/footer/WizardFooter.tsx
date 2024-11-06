import IconButton from "@/components/ui/button/IconButton";
import { IconChevronRight, IconCircleCheck } from "@tabler/icons-react";
import { useWizard } from "react-use-wizard";

const WizardFooter = () => {
  const { nextStep, isLastStep, isLoading } = useWizard();

  return (
    <div className="mt-2 flex gap-2 justify-end">
      {isLastStep ? (
        <IconButton
          type="button"
          onClick={() => nextStep()}
          icon={<IconCircleCheck width={30} height={30} />}
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

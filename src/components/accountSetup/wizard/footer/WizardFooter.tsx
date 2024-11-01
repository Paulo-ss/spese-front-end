import IconButton from "@/components/ui/button/IconButton";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useWizard } from "react-use-wizard";

const WizardFooter = () => {
  const { previousStep, nextStep, isLastStep, isFirstStep, isLoading } =
    useWizard();

  return (
    <div
      className={`mt-2 flex gap-2 ${
        isFirstStep ? "justify-end" : "justify-between"
      }`}
    >
      {!isFirstStep && (
        <IconButton
          type="button"
          onClick={() => previousStep()}
          icon={<IconChevronLeft width={30} height={30} />}
          color="info"
          variant="outlined"
          disabled={isLoading}
        />
      )}

      {isLastStep ? (
        <IconButton
          type="button"
          onClick={() => nextStep()}
          icon={<IconCircleCheck width={30} height={30} />}
          color="primary"
          variant="outlined"
          disabled={isLoading}
          isLoading={isLoading}
        />
      ) : (
        <IconButton
          type="button"
          onClick={() => nextStep()}
          icon={<IconChevronRight width={30} height={30} />}
          color="primary"
          variant="outlined"
          disabled={isLoading}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default WizardFooter;

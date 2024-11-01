import { FC, MutableRefObject, useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import { useWizard } from "react-use-wizard";

interface IProps {
  previousStepRef: MutableRefObject<number>;
}

const BankAccountStep: FC<IProps> = ({ previousStepRef }) => {
  const {
    isLoading,
    isFirstStep,
    isLastStep,
    activeStep,
    previousStep,
    nextStep,
    handleStep,
  } = useWizard();

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
      <div className="flex flex-col py-4">conta bancária</div>
    </Slide>
  );
};

export default BankAccountStep;

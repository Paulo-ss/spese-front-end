import { Slide } from "react-awesome-reveal";
import { useWizard } from "react-use-wizard";

const CreditCardStep = () => {
  const {
    isLoading,
    isFirstStep,
    isLastStep,
    activeStep,
    previousStep,
    nextStep,
    handleStep,
  } = useWizard();

  return (
    <Slide duration={300} direction="right">
      <div className="flex flex-col py-4">cartão de crédito</div>
    </Slide>
  );
};

export default CreditCardStep;

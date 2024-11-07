import { Slide } from "react-awesome-reveal";
import { useWizard } from "react-use-wizard";

const CategoryStep = () => {
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
      <div className="flex flex-col py-4">categoria</div>
    </Slide>
  );
};

export default CategoryStep;

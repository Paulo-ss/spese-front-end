"use client";

import { Wizard } from "react-use-wizard";
import WageStep from "./steps/WageStep";
import WizardHeader from "./wizard/header/WizardHeader";
import WizardFooter from "./wizard/footer/WizardFooter";
import CreditCardStep from "./steps/CreditCardStep";
import BankAccountStep from "./steps/BankAccountStep";
import CategoryStep from "./steps/CategoryStep";
import { useRef } from "react";

const AccountSetup = () => {
  const previousStepRef = useRef(0);

  return (
    <div className="flex flex-col p-4 h-fit bg-white rounded-md shadow-lg w-4/5 sm:w-2/3 lg:w-1/2 overflow-hidden">
      <Wizard
        startIndex={0}
        header={<WizardHeader />}
        footer={<WizardFooter />}
      >
        <WageStep previousStepRef={previousStepRef} />
        <CreditCardStep previousStepRef={previousStepRef} />
        <BankAccountStep previousStepRef={previousStepRef} />
        <CategoryStep previousStepRef={previousStepRef} />
      </Wizard>
    </div>
  );
};

export default AccountSetup;

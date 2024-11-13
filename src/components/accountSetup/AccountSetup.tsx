"use client";

import { Wizard } from "react-use-wizard";
import WageStep from "./steps/WageStep";
import WizardHeader from "./wizard/header/WizardHeader";
import CreditCardStep from "./steps/CreditCardStep";
import BankAccountStep from "./steps/BankAccountStep";
import CategoryStep from "./steps/CategoryStep";

const AccountSetup = () => {
  return (
    <div className="flex flex-col w-screen md:max-w-4xl">
      <Wizard startIndex={0} header={<WizardHeader />}>
        <WageStep />
        <BankAccountStep />
        <CreditCardStep />
        <CategoryStep />
      </Wizard>
    </div>
  );
};

export default AccountSetup;

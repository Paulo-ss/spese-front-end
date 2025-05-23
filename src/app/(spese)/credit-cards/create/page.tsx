import CreditCardForm from "@/components/forms/creditCardForm/CreditCardForm";
import PageContainer from "@/components/pageContainer/PageContainer";

export default function CreateCreditCardPage() {
  return (
    <PageContainer title="creditCard.registerYourCards">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex">
          <CreditCardForm />
        </div>
      </div>
    </PageContainer>
  );
}

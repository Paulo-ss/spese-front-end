"use client";

import { Banks } from "@/enums/banks.enum";
import { ICreditCard } from "@/interfaces/credit-card.interface";
import Image from "next/image";
import { FC } from "react";

interface IProps {
  creditCard: ICreditCard;
}

const bankColors = {
  [Banks.NUBANK]: "bg-purple-600 shadow-purple-600",
  [Banks.INTER]: "bg-orange-500 shadow-orange-600",
  [Banks.BRADESCO]: "bg-red-600 shadow-red-600",
  [Banks.ITAU]: "bg-amber-600 shadow-amber-600",
};

const CreditCard: FC<IProps> = ({ creditCard }) => {
  return (
    <div
      className={`relative w-full sm:max-w-80 h-40 rounded-md p-2 md:p-4 text-zinc-50 shadow-2xl ${
        bankColors[creditCard.bank]
      }`}
    >
      <div className="absolute top-4 left-2 md:left-4 flex items-center gap-1 md:gap-2">
        <Image
          src={`/images/logos/${creditCard.bank}.png`}
          width={512}
          height={512}
          alt={`${creditCard?.bank} logo`}
          className="w-6 h-6 rounded-full"
        />

        <p className="font-bold">{creditCard?.nickname}</p>
      </div>

      <div className="absolute bottom-4 left-2 md:left-4">
        <p className="text-sm">* * * * {creditCard.lastFourDigits}</p>
      </div>
    </div>
  );
};

export default CreditCard;

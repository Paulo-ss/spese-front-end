import { ICreditCard } from "./credit-card.interface";

export interface ISubscription {
  id: number;
  name: string;
  price: number;
  creditCard: ICreditCard;
  billingDay: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionFiltersForm {
  creditCardId?: number | null;
}

export interface ISubscriptionForm {
  name: string;
  price: number;
  creditCardId: number;
  billingDay: number;
}

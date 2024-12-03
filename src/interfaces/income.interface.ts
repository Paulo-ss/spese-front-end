export interface IIncome {
  id: number;
  name: string;
  value: number;
  userId: number;
  incomeMonth: string;
  updatedAt: Date;
}

export interface IIncomeForm {
  name: string;
  value: number;
  date: Date;
}

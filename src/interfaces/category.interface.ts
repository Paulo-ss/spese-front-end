export interface ICategory {
  id: number;
  name: string;
  userId: number;
}

export interface ICategoryForm {
  categories: { name: string }[];
}

import { categories } from "@/utils/category/categoriesLangIcon";

export interface ICategory {
  id: number;
  name: string;
  color: string;
  userId: number;
}

export interface ICategoryForm {
  categories: { name: string; color: string }[];
}

export type CategoryKey = keyof typeof categories;

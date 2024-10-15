import { ReactNode } from "react";

export interface IMenuItem {
  title: string;
  subHeader?: boolean;
  path?: string;
  onClick?: () => void;
  children?: IMenuItem[];
  icon?: ReactNode;
}

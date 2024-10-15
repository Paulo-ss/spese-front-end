import { FC, MouseEvent, ReactNode } from "react";

interface IProps {
  onClick: (e: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

const HeaderItem: FC<IProps> = ({ onClick, children }) => {
  return (
    <li
      className="relative flex justify-center items-center cursor-pointer p-2 rounded-full hover:bg-primary dark:hover:bg-primary-dark transition-colors"
      onClick={onClick}
    >
      {children}
    </li>
  );
};

export default HeaderItem;

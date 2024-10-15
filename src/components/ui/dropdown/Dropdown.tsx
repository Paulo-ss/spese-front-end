import { FC, ReactNode } from "react";
import Backdrop from "../backdrop/Backdrop";

interface IProps {
  anchorEl: HTMLElement | null;
  isOpened: boolean;
  children: ReactNode;
  closeDropdown: () => void;
}

const Dropdown: FC<IProps> = ({
  anchorEl,
  isOpened,
  children,
  closeDropdown,
}) => {
  let distanceFromRight = 0;

  if (anchorEl) {
    distanceFromRight =
      window.innerWidth -
      (anchorEl?.getBoundingClientRect().left +
        anchorEl?.getBoundingClientRect().width);
  }

  return (
    <Backdrop isOpened={isOpened} handleClose={closeDropdown}>
      <div
        className={`bg-white dark:bg-zinc-800 flex flex-col items-center absolute top-16 right-4 w-fit max-w-80 max-h-[400px] p-4 rounded-md shadow-md transition-all overflow-auto`}
        style={{ right: `${distanceFromRight}px` }}
      >
        {children}
      </div>
    </Backdrop>
  );
};

export default Dropdown;

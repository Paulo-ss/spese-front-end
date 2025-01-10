import { FC, ReactNode } from "react";
import Backdrop from "../backdrop/Backdrop";
import { Transition, TransitionChild } from "@headlessui/react";

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
    <Transition show={isOpened} as="div" className="z-50">
      <Backdrop isOpened={isOpened} handleClose={closeDropdown}>
        <TransitionChild>
          <div
            className="bg-white dark:bg-zinc-900 flex flex-col items-center absolute top-16 w-fit max-w-80 max-h-[400px] p-4 rounded-md shadow-md overflow-auto transition ease-in-out data-[closed]:opacity-0 data-[closed]:translate-x-8 z-50"
            style={{ right: `${distanceFromRight}px` }}
          >
            {children}
          </div>
        </TransitionChild>
      </Backdrop>
    </Transition>
  );
};

export default Dropdown;

import { IMenuItem } from "@/interfaces/menu-items.interface";
import { FC, Fragment, useState } from "react";
import MenuItem from "../MenuItem/MenuItem";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface IProps {
  item: IMenuItem;
}

export const MenuCollapse: FC<IProps> = ({ item }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Fragment>
      <li
        className="flex items-center w-full p-3 mb-1 hover:bg-primary dark:hover:bg-primary-dark rounded-md transition-colors cursor-pointer"
        onClick={() => {
          setIsOpened((state) => !state);
        }}
      >
        {item.icon && <span className="mr-2 grow-0">{item.icon}</span>}

        <p className="text-sm grow">{item.title}</p>

        <span className="mr-2 grow-0">
          {isOpened ? <IconChevronUp /> : <IconChevronDown />}
        </span>
      </li>

      <ul
        className={`max-h-0 overflow-hidden transition-all ${
          isOpened && "max-h-96"
        }`}
      >
        {item.children!.map((i, index) => (
          <MenuItem key={index} item={i} level={2} />
        ))}
      </ul>
    </Fragment>
  );
};

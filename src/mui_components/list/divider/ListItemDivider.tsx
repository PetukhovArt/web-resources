import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { isDesktop } from "react-device-detect";
import "./ListItemDivider.scss";

type ListItemDividerType = {
   title: string | ReactNode;
   icon: ReactNode;
   gray?: boolean;
   className?: CSSProperties;
   disableMb?: boolean;
};

const ListItemDivider = ({ title, icon, gray, disableMb = false }: ListItemDividerType) => {
   const classNames = {
      title: clsx("title", gray && "gray"),
      root: clsx("list-item-divider", !isDesktop && "mobile-divider", disableMb && "no-mb"),
   };

   return (
      <div className={classNames.root}>
         {icon}
         <div className={classNames.title}>{title}</div>
      </div>
   );
};

export default ListItemDivider;

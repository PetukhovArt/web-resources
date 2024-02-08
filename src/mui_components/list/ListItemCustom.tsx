import { ListItem, ListItemText } from "@mui/material";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { isDesktop } from "react-device-detect";

type ListItemCustomType = {
   title: string | ReactNode;
   children: ReactNode;
   deniedBreakStroke?: boolean;
   style?: CSSProperties;
};

const ListItemCustom = ({ title, style, children, deniedBreakStroke = false }: ListItemCustomType) => {
   const customStyle = useMemo(() => {
      return {
         display: deniedBreakStroke || isDesktop ? "flex" : "block",
         paddingBottom: isDesktop ? "8px" : 0,
      };
   }, [isDesktop]);

   return (
      <ListItem style={{ ...customStyle, ...style }}>
         <ListItemText primary={title} />
         <div>{children}</div>
      </ListItem>
   );
};

export default ListItemCustom;

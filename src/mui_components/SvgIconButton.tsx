import { IconButton } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";

import type { OverridableStringUnion } from "@mui/types";
import { forwardRef, type ReactNode } from "react";

export type SvgIconButtonType = {
   svgElement: ReactNode;
   viewBox?: string;
   width?: number;
   height?: number;
   color?: OverridableStringUnion<"default" | "primary">;
   title?: string;
   disabled?: boolean;
   onClick?: (e: any) => any;
};

const SvgIconButton = forwardRef(
   (
      {
         svgElement,
         viewBox,
         color = "default",
         width = 20,
         height = 20,
         title,
         disabled = false,
         onClick,
      }: SvgIconButtonType,
      ref: any,
   ) => (
      <IconButton disabled={disabled} ref={ref} title={title} color={color} onClick={onClick}>
         <SvgIcon
            viewBox={viewBox || `0 0 ${width} ${height}`}
            style={{ width: `${width}px`, height: `${height}px` }}>
            {svgElement}
         </SvgIcon>
      </IconButton>
   ),
);

export default SvgIconButton;

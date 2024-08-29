import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { InputAdornment, TextField, type TextFieldProps, Tooltip } from "@mui/material";

import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from "react";

import { isDesktop } from "react-device-detect";
import { useTranslation } from "react-i18next";
import ListItemCustom from "./ListItemCustom";

type ListItemTextFiledType = {
   prepend?: ReactNode;
   append?: ReactNode;
   width?: string;
   base: TextFieldProps;
   title?: string | ReactNode;
   listItemStyle?: CSSProperties;
   tooltip?: boolean;
   tooltipHint?: string; // main hint translated with t (from useTranslation)
   hintNumbers?: string; // variable ip/number etc. adding this to translated string
};

const ListItemTextFiled = ({
   base,
   title,
   width = "150px",
   prepend,
   append,
   listItemStyle,
   tooltip,
   tooltipHint,
   hintNumbers,
}: ListItemTextFiledType) => {
   const { t } = useTranslation();
   const showTooltip = useMemo(() => base.error && tooltip, [base.error, tooltip]);
   const [hint, setHint] = useState<string | undefined>(undefined);
   // const [isAutoFillValue, setIsAutoFillValue] = useState(false);

   useEffect(() => {
      if (tooltipHint) {
         setHint(tooltipHint);
      }
   }, [tooltipHint, base.error, showTooltip]);

   return (
      <ListItemCustom title={title} style={listItemStyle}>
         {prepend}
         <TextField
            // name={Math.random().toString()}
            {...base}
            autoComplete="off"
            fullWidth={!isDesktop}
            sx={{ width: isDesktop ? width : "-webkit-fill-available" }}
            size="small"
            variant="outlined"
            InputLabelProps={{
               // shrink: isAutoFillValue || undefined,
               sx: {
                  fontSize: "14px",
                  "&.MuiInputLabel-shrink": {
                     top: "1px",
                  },
               },
            }}
            InputProps={{
               endAdornment: showTooltip && (
                  <InputAdornment position="end">
                     <Tooltip title={hintNumbers ? `${t(hint)} ${hintNumbers}` : hint}>
                        <ErrorOutlineOutlinedIcon color="error" />
                     </Tooltip>
                  </InputAdornment>
               ),
            }}
         />
         {append}
      </ListItemCustom>
   );
};

export default ListItemTextFiled;

// InputProps =>
// onAnimationStart: (e) => {
//   if (e.animationName === 'mui-auto-fill') {
//     setIsAutoFillValue(true);
//   }
// },
// onAnimationEnd: (e) => {
//   if (e.animationName === 'mui-auto-fill-cancel') {
//     setIsAutoFillValue(false);
//   }
// },

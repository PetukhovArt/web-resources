import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Autocomplete, InputAdornment, TextField, Tooltip } from "@mui/material";
import type { ChangeEvent, SyntheticEvent } from "react";

import { isDesktop } from "react-device-detect";
import ListItemCustom from "./ListItemCustom";

type ListItemAutocompleteType = {
   title: string;
   value: any;
   elements: any;
   onChange: any;
   errorText?: string;
   error?: boolean;
   label?: string;
   width?: number;
   disabled?: boolean;
   // selectIcon?: boolean;
   onlyNumbers?: boolean;
};

export const ListItemAutocomplete = ({
   title,
   value,
   elements,
   onChange,
   label,
   errorText = "",
   width = 100,
   error = false,
   disabled = false,
   // selectIcon = true,
   onlyNumbers = false,
}: ListItemAutocompleteType) => {
   const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let val = e.target.value;
      if (onlyNumbers) {
         val = val.replace(/\D/g, "");
      }
      if (val === "") {
         val = null;
      }
      onChange(val);
   };

   return (
      <ListItemCustom title={title}>
         <Autocomplete
            disabled={disabled}
            value={value}
            freeSolo
            disableClearable={true}
            size="small"
            options={elements?.length > 0 ? elements.map(e => e) : [value]}
            onChange={(event: SyntheticEvent<Element, Event>, newValue) => {
               onChange(newValue);
            }}
            renderInput={params => (
               <TextField
                  error={error}
                  style={{ width: isDesktop ? `${width}px` : "100%" }}
                  label={label}
                  onChange={e => onInputChange(e)}
                  sx={{
                     ".MuiOutlinedInput-root": { fontSize: "14px!important" },
                  }}
                  {...params}
                  InputProps={{
                     // ...params.InputProps required to autoComplete work correctly
                     ...params.InputProps,
                     endAdornment: error ? (
                        <InputAdornment position="end">
                           <Tooltip title={errorText}>
                              <ErrorOutlineOutlinedIcon color="error" />
                           </Tooltip>
                        </InputAdornment>
                     ) : null,
                  }}
               />
            )}
         />
      </ListItemCustom>
   );
};

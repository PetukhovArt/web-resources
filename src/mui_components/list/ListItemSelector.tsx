import { MenuItem, Select } from "@mui/material";
import { isDesktop } from "react-device-detect";
import ListItemCustom from "./ListItemCustom";

type ListItemSelectorType = {
   title: string;
   value: any;
   disabled?: boolean;
   elements: any;
   onChange: any;
   error?: boolean;
   errorText?: string;
};

const ListItemSelector = ({
   title,
   value,
   disabled = false,
   elements,
   onChange,
   error,
   errorText,
}: ListItemSelectorType) => (
   <ListItemCustom title={title}>
      <Select
         fullWidth={!isDesktop}
         sx={{ fontSize: "14px" }}
         value={value ?? ""}
         disabled={disabled}
         onChange={event => onChange(event.target.value)}
         size="small">
         {elements?.length > 0 ? (
            elements.map((option, index) =>
               typeof option === "object" ? (
                  <MenuItem key={index} value={option.key}>
                     {option.value}
                  </MenuItem>
               ) : (
                  <MenuItem key={index} value={option}>
                     {option}
                  </MenuItem>
               ),
            )
         ) : (
            <MenuItem key={value} value={value}>
               {value}
            </MenuItem>
         )}
      </Select>
   </ListItemCustom>
);

export default ListItemSelector;

import { Slider, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { isDesktop } from "react-device-detect";
import ListItemCustom from "./ListItemCustom";

type ListItemSliderType = {
   title: string;
   value: any;
   min?: number;
   max?: number;
   onChange: any;
   prepend?: any;
};

const ListItemSlider = ({ title, value, min, max, onChange, prepend }: ListItemSliderType) => {
   const [val, setVal] = useState(value);

   useEffect(() => {
      setVal(value);
   }, [value]);

   return (
      <ListItemCustom title={title}>
         <Stack width={isDesktop ? "180px" : "100%"} spacing={2} direction="row" alignItems="center">
            <Slider
               min={min}
               max={max}
               onChangeCommitted={onChange}
               onChange={(e, v) => setVal(v)}
               value={val}
            />
            <span style={{ paddingRight: "4px" }}>{val}</span>
            {prepend}
         </Stack>
      </ListItemCustom>
   );
};

export default ListItemSlider;

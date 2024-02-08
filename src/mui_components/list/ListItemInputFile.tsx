import { MuiFileInput, type MuiFileInputProps } from "mui-file-input";
import type { ReactNode } from "react";

import { isDesktop } from "react-device-detect";
import ListItemCustom from "./ListItemCustom";

type ListItemInputFileType = {
   prepend?: ReactNode;
   append?: ReactNode;
   width?: string;
   base: MuiFileInputProps;
   title: string;
};

const ListItemInputFile = ({ base, title, width = "150px", prepend, append }: ListItemInputFileType) => (
   <ListItemCustom title={title}>
      {prepend}
      <MuiFileInput {...base} size="small" sx={{ width: isDesktop ? width : "-webkit-fill-available" }} />
      {append}
   </ListItemCustom>
);

export default ListItemInputFile;

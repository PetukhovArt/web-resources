import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";

type WarningPartialPropsType = {
   title: string;
};
export const WarningPartial = ({ title }: WarningPartialPropsType) => (
   <Tooltip title={title}>
      <InfoOutlinedIcon color="primary" />
   </Tooltip>
);

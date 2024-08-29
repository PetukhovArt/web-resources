import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { Button, IconButton, ListItem, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type ListItemEditType = {
   title: string;
   editing?: boolean;
   disabled?: boolean;
   onClick: () => void;
   onComplete?: () => void;
   onCancel?: () => void;
};

const ListItemEdit = ({
   title,
   editing = false,
   disabled,
   onClick,
   onComplete,
   onCancel,
}: ListItemEditType) => {
   const { t } = useTranslation();

   useEffect(() => {
      if (disabled) onCancel();
   }, [disabled]);

   return (
      <ListItem>
         <ListItemText primary={title || ""} />
         {editing ? (
            <div>
               <IconButton title={t("Cancel")} onClick={() => onCancel()} size="small">
                  <CloseOutlinedIcon color="error" />
               </IconButton>
               <IconButton title={t("Complete")} onClick={() => onComplete()} size="small">
                  <DoneOutlinedIcon color="info" />
               </IconButton>
            </div>
         ) : (
            <Button
               sx={{ padding: "5px 8px" }}
               variant="text"
               onClick={onClick}
               disabled={disabled}
               endIcon={<CreateOutlinedIcon sx={{ height: "18px" }} color="primary" />}>
               {t("edit")}
            </Button>
         )}
      </ListItem>
   );
};

export default ListItemEdit;

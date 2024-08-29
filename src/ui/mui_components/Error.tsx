import { useTranslation } from "react-i18next";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const Error = () => {
   const { t } = useTranslation();

   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
         }}>
         <ErrorOutlineOutlinedIcon fontSize="large" />
         <h3>{t("There was an error")}</h3>
      </div>
   );
};

export default Error;

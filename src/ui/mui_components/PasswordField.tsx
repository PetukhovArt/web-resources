import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from "@mui/material";
import { type KeyboardEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type PasswordFieldType = {
   password: string;
   autoComplete?: boolean;
   label?: string;
   autoFocus?: boolean;
   showLabel?: boolean;
   id?: string;
   onChange: (value: string) => void;
   onKeyPress?: (event: KeyboardEvent<HTMLDivElement>) => void;
   placeholder?: string;
   disabled?: boolean;
   error?: boolean;
   onBlur?: () => void;
   showTooltip?: boolean;
   toolTiphint?: string;
   maxLength?: number;
};

const PasswordField = ({
   password,
   disabled = false,
   autoComplete = false,
   label = "Password",
   autoFocus = false,
   showLabel = true,
   id,
   onChange,
   onKeyPress = () => {},
   placeholder,
   error,
   onBlur,
   showTooltip = false,
   toolTiphint,
   maxLength,
}: PasswordFieldType) => {
   const { t } = useTranslation();
   const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
   const showTip = useMemo(() => error && showTooltip, [error, showTooltip]);
   const [isAutoFillPassword, setIsAutoFillPassword] = useState(false);

   return (
      <FormControl style={{ width: "100%" }} variant="outlined">
         {showLabel && (
            <InputLabel size="small" htmlFor={label} shrink={isAutoFillPassword || undefined}>
               {t(label)}
            </InputLabel>
         )}
         <OutlinedInput
            sx={{
               "fieldset legend": {
                  maxWidth: isAutoFillPassword || !!password ? "100%" : "0.01px",
               },
               "input:focus ~ fieldset legend": {
                  maxWidth: "100% !important",
               },
               paddingRight: "5px",
            }}
            slotProps={{
               input: {
                  onAnimationStart: e => {
                     if (e.animationName === "mui-auto-fill") {
                        setIsAutoFillPassword(true);
                     }
                  },
                  onAnimationEnd: e => {
                     if (e.animationName === "mui-auto-fill-cancel") {
                        setIsAutoFillPassword(false);
                     }
                  },
                  maxLength: maxLength || undefined,
               },
            }}
            // sx={{ paddingRight: "5px" }}
            error={error}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete={autoComplete ? "on" : "one-time-code"}
            name={label}
            id={id || label}
            type={autoComplete ? (isShowPassword ? "text" : "password") : "text"}
            value={password}
            onChange={e => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            className={isShowPassword ? "" : "password"}
            endAdornment={
               <>
                  {showTip && (
                     <InputAdornment position="end">
                        <Tooltip title={toolTiphint}>
                           <ErrorOutlineOutlinedIcon color="error" />
                        </Tooltip>
                     </InputAdornment>
                  )}
                  <InputAdornment position="end">
                     <IconButton
                        // color={showTooltip && error ? "error" : "primary"}
                        disabled={disabled}
                        title={isShowPassword ? t("hidePassword") : t("showPassword")}
                        onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <Visibility /> : <VisibilityOff />}
                     </IconButton>
                  </InputAdornment>
               </>
            }
            size="small"
            label={showLabel ? label : null}
         />
      </FormControl>
   );
};

export default PasswordField;

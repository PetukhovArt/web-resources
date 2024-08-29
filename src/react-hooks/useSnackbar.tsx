import { DataTransfer } from "@/service/dataTransfer";
import type { IPropseSnackbarEventSave } from "@/types";
import { Button } from "@mui/material";
import { useSnackbar, type VariantType } from "notistack";

import { Fragment, useEffect } from "react";
import { isDesktop } from "react-device-detect";

type Key = string | number;

const transfer = new DataTransfer();

export function UseSnackBar(onCloseSnackbar = () => {}) {
   useEffect(
      () => () => {
         resetCompareDate();
      },
      [],
   );

   const { enqueueSnackbar, closeSnackbar } = useSnackbar();

   const resetCompareDate = async () => {
      transfer.clearOldValue();
      transfer.clearNewValue();
   };

   const close = (key: Key) => (
      <Button
         variant="text"
         style={{ color: "white" }}
         onClick={() => {
            closeSnackbar(key);
         }}>
         Закрыть
      </Button>
   );

   const closeOrSave = (key: Key, callback: any, closeCallback?: any) => (
      <Fragment>
         <Button
            variant="text"
            style={{ color: "white" }}
            onClick={() => {
               if (closeCallback) {
                  closeCallback(key);
               } else {
                  closeSnackbar(key);
               }
            }}>
            Нет
         </Button>
         <Button
            variant="text"
            style={{ color: "white" }}
            onClick={() => {
               callback();
               closeSnackbar(key);
            }}>
            Да
         </Button>
      </Fragment>
   );

   const showSnackbar = (title: string, variant: VariantType = "success") => {
      enqueueSnackbar(title, {
         variant,
         autoHideDuration: 3000,
         action: close,
         anchorOrigin: {
            vertical: "top",
            horizontal: "right",
         },
      });
   };

   // const showSaveSnackbar = (
   //   save: IPropseSnackbarEventSave,
   //   title: string = "Сохранить изменения?",
   // ) => {
   //   transfer.setNewValue(save);
   //   enqueueSnackbar(title, {
   //     variant: "default",
   //     persist: true,
   //     action: (key) => closeOrSave(key, saveEvent, closeEvent),
   //     anchorOrigin: {
   //       vertical: "bottom",
   //       horizontal: "center",
   //     },
   //     style: { paddingBottom: isDesktop ? "0px" : "40px" },
   //   });
   // };

   const showSaveSnackbar = (
      save: IPropseSnackbarEventSave & {
         closeAction?: () => void;
      },
      title: string = "Сохранить изменения?",
   ) => {
      transfer.setNewValue(save);
      enqueueSnackbar(title, {
         variant: "default",
         persist: true,
         action: key => closeOrSave(key, saveEvent, save.closeAction ? save.closeAction : closeEvent),
         anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
         },
         style: { paddingBottom: isDesktop ? "0px" : "40px" },
      });
   };

   const saveEvent = () => {
      transfer.eventSave();
      closeSnackbar();
   };
   const closeEvent = () => {
      transfer.eventClose();
      closeSnackbar();
      onCloseSnackbar();
      // transfer.clearNewValue();
      // transfer.clearOldValue();
   };
   const setDefaultValue = (
      data: any,
      action: (props?: any) => Promise<void> | void,
      message: string = "Данные успешно сохранены",
   ) => {
      // added 10.10.23 for nested objects
      const deepCopyData = JSON.parse(JSON.stringify(data));
      transfer.setOldValue({
         type: "data",
         action,
         data: deepCopyData,
         message,
      });
   };

   const getOldValue = () => transfer.oldValue;
   return {
      showSnackbar,
      showSaveSnackbar,
      closeSnackbar,
      closeEvent,
      setDefaultValue,
      oldValue: getOldValue,
      resetCompareDate,
   };
}

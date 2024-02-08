import { action, makeObservable, observable } from "mobx";
import type { OptionsObject } from "notistack";
/* 
variant: default | error | success | warning | info
*/
type TVariant = "default" | "error" | "success" | "warning" | "info";

class NotificationService {
   notifications: OptionsObject[] = [];

   constructor() {
      makeObservable(this, {
         notifications: observable,
         removeSnackbar: action,
         enqueueSnackbar: action,
      });
   }

   enqueueSnackbar = (
      message: string = "Изменения сохранены успешно",
      variant: TVariant = "success",
      autoHideDuration: number = 3000,
   ) => {
      const obj = {
         key: new Date().getTime() + Math.random(),
         message,
         options: {
            variant,
            autoHideDuration,
            anchorOrigin: {
               vertical: "top",
               horizontal: "right",
            },
         },
      };
      this.notifications = [...this.notifications, obj];
   };

   removeSnackbar = (key: any) => {
      this.notifications = this.notifications.filter(notification => notification.key !== key);
   };
}

export default new NotificationService();

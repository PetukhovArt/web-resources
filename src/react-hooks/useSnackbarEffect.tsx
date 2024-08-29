import { useEffect } from "react";
import { useQueryClient } from "react-query";

/**
 * Custom React hook to manage actions and side effects related to Snackbar notifications.
 *
 * @param {closeCondition} options.condition - Optional, condition to control when to close Snackbar and to prevent the save operation.
 * @param {snackBarCloseFunction} options.snackBarCloseFunction - Callback function that is invoked when the Snackbar is closed.
 * @param {snackBarOpenFunction} options.snackBarOpenFunction - Callback function that is invoked to save data.
 * @param {initDependencyData} options.initDependencyData - Initial data that the effect depends on. The effect will re-run whenever this data changes.
 * @param {snackOpenTimeout} [options.snackOpenTimeout=300] - Optional. Timeout in milliseconds before the onSave operation is invoked. Defaults to 300.
 * @param {queryKeysCancellationInCleanup} [options.queryKeysCancellationInCleanup] - optional. Array of query keys to be cancelled in cleanup.
 *
 * @example
 * useSnackbarEffect({
 *   closeCondition: !isSuccess || isFormInvalid,
 *   snackBarCloseFunction: closeSnackbar,
 *   snackBarOpenFunction: save,
 *   initDependencyData: alertsData,
 *   queryKeysCancellationInCleanup: ["email-get", "email-upload"], //query keys
 * });
 */
export const useSnackbarEffect = (options: {
   closeCondition?: boolean;
   snackBarCloseFunction: () => void;
   snackBarOpenFunction: () => void;
   initDependencyData: unknown;
   snackOpenTimeout?: number;
   queryKeysCancellationInCleanup?: string[];
}) => {
   const {
      closeCondition = false,
      queryKeysCancellationInCleanup = [],
      snackBarCloseFunction,
      snackBarOpenFunction,
      initDependencyData,
      snackOpenTimeout = 300,
   } = options;
   useEffect(() => {
      if (closeCondition) {
         snackBarCloseFunction();
         return;
      }
      const timer = setTimeout(() => {
         snackBarOpenFunction();
      }, snackOpenTimeout);
      return () => {
         clearTimeout(timer);
      };
   }, [initDependencyData]);

   const queryClient = useQueryClient();

   useEffect(
      // only cleanup effect
      () => () => {
         snackBarCloseFunction();
         if (queryKeysCancellationInCleanup?.length) {
            queryKeysCancellationInCleanup.forEach(key => {
               queryClient.cancelQueries(key);
            });
         }
      },
      [],
   );
};

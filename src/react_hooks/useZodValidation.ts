import { useRef, useState } from "react";
import { ZodError, type ZodType } from "zod";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useZodValidation<T>(
   schema?: ZodType<T>,
   data?: T,
): {
   hasError: (field: keyof T) => boolean;
   getErrorMessage: (field: keyof T) => string | undefined;
   isFormInvalid: boolean;
   setFieldTouched: (value: keyof T) => void;
   hasErrorUnTouched: (field: keyof T) => boolean;
} {
   const errorsRef = useRef<ValidationErrors<T>>({});
   const [touchedFields, setTouchedFields] = useState<Set<keyof T>>(new Set());
   try {
      schema.parse(data);
      errorsRef.current = {};
   } catch (error) {
      if (error instanceof ZodError) {
         errorsRef.current = error.errors.reduce((acc, err) => {
            // for some paths in error (custom error with refine/superRefine)
            if (err.path.length > 1) {
               err.path.forEach(path => {
                  acc[path] = err.message;
               });
            }
            // for one path in error
            else if (err.path[0]) {
               acc[err.path[0]] = err.message;
            }
            return acc;
         }, {} as ValidationErrors<T>);
      }
   }
   const setFieldTouched = (field: keyof T) => {
      if (!(field in touchedFields)) {
         setTouchedFields(prevState => {
            return { ...prevState, [field]: true };
         });
      }
   };
   const hasError = (field: keyof T): boolean => !!errorsRef.current[field] && field in touchedFields;
   const hasErrorUnTouched = (field: keyof T): boolean => !!errorsRef.current[field];
   const getErrorMessage = (field: keyof T): string | undefined => errorsRef.current[field];
   const isFormInvalid = !schema.safeParse(data).success;
   return {
      hasError,
      getErrorMessage,
      isFormInvalid,
      setFieldTouched,
      hasErrorUnTouched,
   };
}

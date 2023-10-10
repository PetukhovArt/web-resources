import { useRef, useState } from "react";
import { ZodError, ZodType } from "zod";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

/**
 * A custom React hook that validates a data object against a Zod schema.
 * It returns two functions: one to check if a specific field has an error,
 * and another one to get the error message of a specific field.
 *
 * @param {ZodType<T>} schema - The Zod schema against which the data object will be validated.
 * @param {T} data - The data object to be validated.
 *
 * @returns {[(field: keyof T) => boolean, (field: keyof T) => string | undefined], boolean}
 * - where the first element is a function,that accepts a field name and returns a boolean indicating if the field has an error,
 * the second element is a function that accepts a field name and returns the error message of the field if it exists.
 * the third element is boolean that show is form invalid or not ( to disable smth in your components)
 *
 * @template T - The type of the data object.
 *
 * @example
 * const [hasError, getErrorMessage] = useZodValidation(schema, data);
 * if (hasError('fieldName')) {
 *   console.log(getErrorMessage('fieldName'));
 * }
 */

export function useZodValidation<T>(
  schema?: ZodType<T>,
  data?: T,
): [
  (field: keyof T) => boolean,
  (field: keyof T) => string | undefined,
  boolean,
  (value: keyof T) => void,
] {
  const errorsRef = useRef<ValidationErrors<T>>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof T>>(new Set());

  try {
    schema.parse(data);
    errorsRef.current = {};
  } catch (error) {
    if (error instanceof ZodError) {
      errorsRef.current = error.errors.reduce((acc, err) => {
        if (err.path[0]) {
          acc[err.path[0]] = err.message;
        }
        return acc;
      }, {} as ValidationErrors<T>);
    }
  }

  const setFieldTouched = (field: keyof T) => {
    if (!(field in touchedFields)) {
      setTouchedFields((prevState) => ({ ...prevState, [field]: true }));
    }
  };

  const hasError = (field: keyof T): boolean => {
    // return !!errorsRef.current[field];
    return !!errorsRef.current[field] && field in touchedFields;
  };

  const getErrorMessage = (field: keyof T): string | undefined => errorsRef.current[field];

  const isFormInvalid = !schema.safeParse(data).success;

  return [hasError, getErrorMessage, isFormInvalid, setFieldTouched];
}

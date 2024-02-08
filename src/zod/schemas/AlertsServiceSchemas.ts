import { TimeoutNumberSchema } from "@/utils/schemas/TimeoutNumberSchema";
import { z } from "zod";

const AlertsEventTypeSchema = z.enum(["GPIO", "Motion"]);
export type AlertsEventType = z.infer<typeof AlertsEventTypeSchema>;

export const AlertTypeSchema = z.object({
   //  add type of new option
   type: AlertsEventTypeSchema,
   telegram: z.boolean().optional(),
   email: z.boolean().optional(),
   fileServer: z.boolean().optional(),
   gpio: z.boolean().optional(),
   light: z.boolean().optional(),
   push: z.boolean().optional(),
   timeout: TimeoutNumberSchema.optional(),
});
export type AlertDataType = z.infer<typeof AlertTypeSchema>;
export const AlertsSchemaArray = z.array(AlertTypeSchema);
export type AlertsDataType = AlertDataType[];

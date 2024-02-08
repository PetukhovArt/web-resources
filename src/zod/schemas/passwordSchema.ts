import { z } from "zod";

export const passwordFieldSchema = z.object({
   key: z.string().min(8, "Min length 8").min(1, "Required field"),
});

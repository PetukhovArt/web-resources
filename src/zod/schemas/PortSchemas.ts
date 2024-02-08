import { z } from "zod";

export const PortSchema = z.number().min(1).max(65535).or(z.literal(""));

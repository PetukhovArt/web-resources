import { z } from "zod";

export const TimeoutNumberSchema = z.number().min(0, "Min value").max(600, "Max value").or(z.literal(""));

export const TimeoutLightSchema = z.number().min(1, "Min value").max(600, "Max value").or(z.literal(""));

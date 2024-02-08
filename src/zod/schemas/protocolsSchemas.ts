import { z } from "zod";

const isValidFirstOctet = (ip: string) => {
   if (ip.length >= 3) {
      const firstOctet = Number(ip.substring(0, 3));
      return !(firstOctet < 224 || firstOctet > 239);
   }
};

export const MulticastSchema = z.object({
   from: z.string().ip({ message: "Incorrect address" }).refine(isValidFirstOctet, "validRange"),
   to: z.string().ip({ message: "Incorrect address" }).refine(isValidFirstOctet, "validRange"),
});

export type MulticastDataType = z.infer<typeof MulticastSchema>;

export const RtmpSchema = z.object({
   enabled: z.boolean(),
   stream: z.string().optional(),
   url: z
      .string()
      .optional()
      .refine(url => url === "" || url.startsWith("rtmp://") || url.startsWith("rtmps://"), {
         message: "Incorrect address",
      }),
});

export type RtmpDataType = z.infer<typeof RtmpSchema>;

export const AuthXSchema = z.object({
   enabled: z.boolean(),
   EAPOLVersion: z.number(),
   user: z.string().optional(),
   password: z.string().optional(),
});

export type AuthXDataType = z.infer<typeof AuthXSchema>;

export const QosSchema = z.object({
   httpDscp: z.number().min(0, "validRange").max(63, "validRange").optional(),
   rtspDscp: z.number().min(0, "validRange").max(63, "validRange").optional(),
});
export type QosDataType = z.infer<typeof QosSchema>;

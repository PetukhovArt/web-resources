import { ipToInteger, isIpInList, isIpInRange } from "@/utils/common";
import { z } from "zod";

export const IpRangeSchema = (t: any, cameraIp: string) =>
   z
      .object({
         ip1: z
            .string()
            .ip(t("Check that the IP address is correct"))
            .or(z.literal(""))
            .refine(value => value !== cameraIp, t("Cannot use camera IP address")),
         ip2: z
            .string()
            .ip(t("Check that the IP address is correct"))
            .or(z.literal(""))
            .refine(value => value !== cameraIp, t("Cannot use camera IP address")),
      })
      .refine(IpRangeSchema => !isIpInRange(IpRangeSchema.ip1, IpRangeSchema.ip2, cameraIp), {
         path: ["ip1"],
         message: t("IP address range contains camera IP"),
      })
      .refine(
         IpRangeSchema => {
            const ipStartInt = ipToInteger(IpRangeSchema.ip1);
            const ipEndInt = ipToInteger(IpRangeSchema.ip2);
            if (ipStartInt) {
               return ipStartInt < ipEndInt;
            }
            return true;
         },
         {
            path: ["ip1"],
            message: t("Starting ip must be lower than destination ip"),
         },
      );

export const IpSchema = (t: any, cameraIp: string, ipList: string[]) =>
   z.object({
      ip1: z
         .string()
         .ip(t("Check that the IP address is correct"))
         .or(z.literal(""))
         .refine(value => value !== cameraIp, t("Cannot use camera IP address"))
         .refine(value => !isIpInList(value, ipList), t("IP address already exists")),
      ip2: z.any(),
   });

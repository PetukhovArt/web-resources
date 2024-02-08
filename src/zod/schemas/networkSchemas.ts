import { isIpOrDns } from "@/utils/common";
import { z } from "zod";

const IPnumber = (ipAddress: string) => {
   const ip = ipAddress.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
   if (ip) {
      return (+ip[1] << 24) + (+ip[2] << 16) + (+ip[3] << 8) + +ip[4];
   }
   return null;
};

const gateWayTest = (ip: string, mask: string, gateway: string) => {
   const ipNumber = IPnumber(ip);
   const maskNumber = IPnumber(mask);
   const gatewayNumber = IPnumber(gateway);
   // Calculate the network address
   const networkAddress = ipNumber & maskNumber;
   // Check if the gateway is within the subnet
   // eslint-disable-next-line eqeqeq
   return (gatewayNumber & maskNumber) == networkAddress;
};

export const IPv4Schema = t =>
   z
      .object({
         dhcpEnabled: z.boolean(),
         ip: z
            .string()
            .ip({ version: "v4", message: t("Incorrect address") })
            .min(1, t("Required field")),

         mask: z
            .string()
            .ip({ version: "v4", message: t("Incorrect address") })
            .min(1, t("Required field")),

         gateway: z
            .string()
            .ip({ version: "v4", message: t("Incorrect address") })
            .min(1, t("Required field")),
         dns1: z
            .string()
            .ip({ message: t("Incorrect address") })
            .or(z.literal("")),
         dns2: z
            .string()
            .ip({ message: t("Incorrect address") })
            .or(z.literal("")),
      })
      .refine(
         IPv4Schema => {
            const valuesAreExist =
               IPv4Schema.gateway.length > 1 && IPv4Schema.mask.length > 1 && IPv4Schema.ip.length > 1;
            const valuesAreValid =
               isIpOrDns(IPv4Schema.ip) && isIpOrDns(IPv4Schema.mask) && isIpOrDns(IPv4Schema.gateway);
            // first for base validation, then refine
            if (valuesAreExist && valuesAreValid) {
               return gateWayTest(IPv4Schema.ip, IPv4Schema.mask, IPv4Schema.gateway);
            }
            return true;
         },
         {
            message: t(
               "The default gateway is not on the same subnet as defined by the IP address and subnet mask",
            ),
            path: ["gateway", "ip", "mask"],
         },
      )
      .refine(
         IPv4Schema => {
            if (IPv4Schema.dns1 && IPv4Schema.dns2) {
               return IPv4Schema.dns1 !== IPv4Schema.dns2;
            }
            return true;
         },
         {
            message: t("DNS addresses must be different"),
            path: ["dns2"],
         },
      );

export const IPv6Schema = t =>
   z
      .object({
         dhcpEnabled: z.boolean(),
         ip: z
            .string()
            .ip({ version: "v6", message: t("Incorrect address") })
            .or(z.literal("")),
         mask: z
            // works if we don't need to input 0 (MUI input as string)
            .any()
            .refine(v => +v <= 128, `${t("validRange")} 1 - 128`)
            .refine(value => value !== undefined && value !== 0, t("Required field")),
         gateway: z
            .string()
            .ip({ version: "v6", message: t("Incorrect address") })
            .or(z.literal("")),
         dns1: z
            .string()
            .ip({ message: t("Incorrect address") })
            .or(z.literal("")),
         dns2: z
            .string()
            .ip({ message: t("Incorrect address") })
            .or(z.literal("")),
      })
      .refine(
         IPv6Schema => {
            if (IPv6Schema.dns1 && IPv6Schema.dns2) {
               return IPv6Schema.dns1 !== IPv6Schema.dns2;
            }
            return true;
         },
         {
            message: t("DNS addresses must be different"),
            path: ["dns2"],
         },
      );

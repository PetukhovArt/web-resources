import { z } from "zod";

export const SnmpUserNameSchema = z
   // for userName validation ( ro / rw - one of them is required)
   .object({
      roUserName: z.string(),
      rwUserName: z.string(),
   })
   .refine(data => !(data.roUserName.length === 0 && data.rwUserName.length === 0), {
      message: "For the protocol to work correctly, fill in the username",
      path: ["roUserName"],
   });

export const SnmpRouserSchema = z
   .object({
      authKey: z.string().optional(),
      privKey: z.string().optional(),
      userName: z
         .string()
         .regex(/^[^\u0400-\u04FF]+$/, "Cyrillic characters are not allowed")
         .or(z.literal("")),
      lvlSecurity: z.object({
         auth: z.boolean(),
         priv: z.boolean(),
      }),
   })
   .refine(
      SnmpRouserSchema =>
         !(
            SnmpRouserSchema.lvlSecurity.auth === true &&
            (SnmpRouserSchema.authKey.length < 8 || SnmpRouserSchema.authKey === "")
         ),
      {
         message: "Required field",
         path: ["authKey"],
      },
   )
   .refine(
      SnmpRouserSchema =>
         !(
            SnmpRouserSchema.lvlSecurity.priv === true &&
            (SnmpRouserSchema.privKey.length < 8 || SnmpRouserSchema.privKey === "")
         ),
      {
         message: "Required field",
         path: ["privKey"],
      },
   )
   .refine(
      SnmpRouserSchema =>
         !(SnmpRouserSchema.lvlSecurity.auth === true && SnmpRouserSchema.userName.length < 1),
      {
         message: "Required field",
         path: ["userName"],
      },
   );

export const SnmpV3DataSchema = z.object({
   snmpPort: z
      .number()
      .refine(value => value !== undefined && value !== 0, "Required field")
      .refine(value => +value > 0 && +value <= 65535, "validRange"),
   trapIPaddr: z.string().ip("Incorrect address").or(z.literal("")),
   trapPort: z
      .number()
      .refine(value => value !== undefined && value !== 0, "Required field")
      .refine(value => +value > 0 && +value <= 65535, "validRange"),
   enable: z.boolean(),
   readCommunity: z.string(),
   snmpVers: z.string(),
   writeCommunity: z.string(),
   SNMPUser: z.object({
      rouser: SnmpRouserSchema,
      rwuser: SnmpRouserSchema,
   }),
});

export const SnmpV1V2Schema = z.object({
   snmpPort: z
      .number()
      .refine(value => value !== undefined && value !== 0, "Required field")
      .refine(value => +value > 0 && +value <= 65535, "validRange"),

   trapIPaddr: z.string().ip("Incorrect address").or(z.literal("")),
   trapPort: z
      .number()
      .refine(value => value !== undefined && value !== 0, "Required field")
      .refine(value => +value > 0 && +value <= 65535, "validRange"),
});

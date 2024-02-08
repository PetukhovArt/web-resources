import {
   isIpOrDns,
   isNonDotRegExp,
   isTelegramIdRegExp,
   isUserNameRegExp,
   isUserWithEmailRegExp,
} from "@/utils/common";
import { boolean, z } from "zod";

const isPortValid = (value: number) => {
   const num = +value;
   return num >= 1 && num <= 65535;
};

export const FileNameSchema = z
   .string()
   .refine(v => (v ? isNonDotRegExp(v) : true), "Incorrect name")
   .or(z.literal(""));
export const FileNameRequiredSchema = z
   .string()
   .min(1)
   .refine(v => (v ? isNonDotRegExp(v) : true), "Incorrect name");

export const PushFormSchema = z.object({
   method: z.string().optional(),
   enabled: boolean(),
   address: z
      .string()
      .optional()
      .refine(v => (v ? isIpOrDns(v) : true), "Incorrect address"),
   noticeName: z.string().optional(),
   port: z
      .number()
      .optional()
      .refine(v => (v ? isPortValid(v) : true), "validRange"),
   url: z.string().optional(),
   username: z.string().optional(),
   pass: z.string().optional(),
});
export type PushDataType = z.infer<typeof PushFormSchema>;

export const PushFormRequiredSchema = z.object({
   // for check button disabling
   method: z.string().optional(),
   enabled: boolean(),
   address: z
      .string()
      .min(1)
      .refine(v => isIpOrDns(v)),
   noticeName: z.string().min(1),
   port: z.number().refine(v => isPortValid(v)),
   url: z.string().min(1),
   username: z.string(),
   pass: z.string(),
});

export const TelegramFormSchema = z.object({
   enabled: boolean(),
   token: z.string(),
   chatID: z
      .string()
      .refine(v => {
         if (v) {
            return /^-?\d+$/.test(v);
         }
      }, "Invalid chat ID, valid values: - , 0-9")
      .or(z.literal("")),
});

export const TelegramFormRequired = z.object({
   // for check button disabling
   enabled: boolean(),
   token: z.string().min(1),
   chatID: z
      .string()
      .min(1)
      .refine(v => {
         if (v) {
            return isTelegramIdRegExp(v);
         }
      }),
});
export type TelegramDataType = z.infer<typeof TelegramFormRequired>;

const EmailSchema = z
   .string()
   .refine(v => (v ? isUserWithEmailRegExp(v) : true), "Incorrect address")
   .or(z.literal(""));
const UserSchema = z
   .string()
   .refine(v => (v ? isUserWithEmailRegExp(v) || isUserNameRegExp(v) : true), "Incorrect username")
   .or(z.literal(""));
const EmailSchemaRequired = z
   .string()
   .min(1)
   .refine(v => (v ? isUserWithEmailRegExp(v) : true));

export const EmailFormSchema = z.object({
   enabled: boolean(),
   user: UserSchema,
   pass: z.string().or(z.literal("")),
   sender: EmailSchema,
   senderName: z.string().or(z.literal("")),
   receiver: EmailSchema,
   smtpPort: z
      .number()
      .refine(v => (v ? isPortValid(v) : true), "validRange")
      .or(z.literal("")),
   smtpAddress: z
      .string()
      .refine(v => (v ? isIpOrDns(v) : true), "Incorrect address")
      .or(z.literal("")),
   crypto: z.string().optional(),
   filename: FileNameSchema,
});
export type EmailDataType = z.infer<typeof EmailFormSchema>;

export const EmailFormRequiredSchema = z.object({
   // for check button disabling, error text not needed
   enabled: boolean(),
   user: UserSchema,
   pass: z.string().optional(),
   // sender: z.string().email().min(1),
   sender: EmailSchemaRequired,
   senderName: z.string().min(1),
   // receiver: z.string().email().min(1),
   receiver: EmailSchemaRequired,
   smtpPort: z
      .number()
      .min(1)
      .refine(v => (v ? isPortValid(v) : true)),
   smtpAddress: z
      .string()
      .min(1)
      .refine(v => (v ? isIpOrDns(v) : true)),
   crypto: z.string().optional(),
   filename: FileNameRequiredSchema,
});

const FtpPortSchema = z
   .number()
   .optional()
   .refine(v => (v ? isPortValid(v) : true), "validRange");

const FtpHostSchema = z
   .string()
   .optional()
   .refine(v => (v ? isIpOrDns(v) : true), "Incorrect address");

export const FtpFormSchema = z.object({
   port: FtpPortSchema,
   host: FtpHostSchema,
   user: z.string().optional(),
   password: z.string().optional(),
   crypto: z.string().optional(),
   filePrefix: FileNameSchema,
   path: z.string().optional(),
});

export const SFtpFormSchema = z.object({
   port: FtpPortSchema,
   host: FtpHostSchema,
   user: z.string().optional(),
   password: z.string().optional(),
   filePrefix: FileNameSchema,
   path: z.string().optional(),
});

export const NfsFormSchema = z.object({
   host: FtpHostSchema,
   filePrefix: FileNameSchema,
   path: z.string().optional(),
});

const PortRequired = z.number().refine(v => isPortValid(v), "validRange");

const HostRequired = z.string().refine(v => isIpOrDns(v), "Incorrect address");

export const StringRequired = z.string().min(1);

export const FtpFormRequiredForCheck = z.object({
   port: PortRequired,
   host: HostRequired,
   user: StringRequired,
   password: StringRequired,
   filePrefix: StringRequired,
});

export const SFtpFormRequiredForCheck = z.object({
   port: PortRequired,
   host: HostRequired,
   user: StringRequired,
   password: StringRequired,
   filePrefix: FileNameRequiredSchema,
});

export const NfsFormRequiredForCheck = z.object({
   host: HostRequired,
   filePrefix: FileNameRequiredSchema,
   path: StringRequired,
});

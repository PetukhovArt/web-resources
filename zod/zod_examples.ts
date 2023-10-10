import {z} from 'zod';

export const snmp_data_schema = (t) =>
	z.object({
		snmpPort: z.number().refine((value) => value !== undefined && value !== 0, t("Required field")),
		trapIPaddr: z.string().nonempty(t("Required field")).ip(t("Incorrect address")),
		trapPort: z.number().refine((value) => value !== undefined && value !== 0, t("Required field")),
		enable: z.boolean(),
		readCommunity: z.string(),
		snmpVers: z.string(),
		writeCommunity: z.string(),
		SNMPUser: z.object({
			rouser: snmp_user_schema(t),
			rwuser: snmp_user_schema(t),
		}),
	});

export const snmp_user_schema = (t) =>
	z.object({
		authKey: z
			.string()
			.optional()
			.refine((value) => value !== null && value.length < 8, t("Min length 8")),
		//if field empty no check or => check length
		privKey: z
			.string()
			.optional()
			// .refine((value) => value?.length < 8 ?? false, t("Min length 8")),
			.refine((value) => value !== null && value.length < 8, t("Min length 8")),
		//if field empty no check or => check length
		userName: z.string(),
		authMethod: z.string(),
		lvlSecurity: z.object({
			auth: z.boolean(),
			priv: z.boolean(),
		}),
		privacyMethod: z.string(),
	});

export const snmp_data_optional_schema = (t) => snmp_data_schema(t).deepPartial();
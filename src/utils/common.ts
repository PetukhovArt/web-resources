import { DEV_IP, DEV_PORT, IS_PROD } from "@/constants";
import { t } from "i18next";
import NotificationService from "../service/NotificationService";

// REGEXP VALIDATIONS START ========================================
// for user / sender / receiver
export const userWithEmailRegExp =
   /^(?=.{1,254}$)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const userRegExp = /^(?=.{1,254}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/;
export const ipRegExp =
   /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const dnsRegExp = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/;
export const isIpOrDns = (value: string): boolean => ipRegExp.test(value) || dnsRegExp.test(value);
export const isNonDotRegExp = (value: string): boolean => /^([^.]+)$/.test(value);
export const isUserNameRegExp = (value: string): boolean => userRegExp.test(value);
export const isTelegramIdRegExp = (value: string): boolean => /^-?\d+$/.test(value);
export const isUserWithEmailRegExp = (value: string): boolean => userWithEmailRegExp.test(value);
// REGEXP VALIDATIONS END ========================================

export const isDevelopment = () => process.env.NODE_ENV === "development";

export const getIP = () => (IS_PROD ? document.location.hostname : DEV_IP);

export const getWsType = () => (document.location.protocol === "http:" ? "ws" : "wss");

export const getPort = () => (IS_PROD ? document.location.port : DEV_PORT);

export const generateUrl = (path: string = "") => {
   const host = getIP();
   const port = getPort();
   const httpType = document.location.protocol === "http:" ? "http" : "https";
   return `${httpType}://${host}:${port}${path}`;
};

export const generateWsUrl = (path: string = "") => {
   const host = getIP();
   const port = getPort();
   const wsType = getWsType();
   return `${wsType}://${host}:${port}${path}`;
};

// export const preventNonNumberPaste = (e: any) => {
//    const pasteData = e.clipboardData.getData("text");
//    const regEx = /^[0-9\b]+$/;
//    if (!regEx.test(pasteData)) {
//       e.preventDefault();
//    }
// };
//
// export const preventNonNumberInput = (e: any) => {
//    if (!/[0-9]/.test(e.key)) {
//       e.preventDefault();
//    }
// };

export const setClipboard = async (data: string) => {
   const isClipboardApiSupported = navigator!.clipboard;
   if (isClipboardApiSupported) await navigator!.clipboard.writeText(data);
   else legacyCopy(data);
   NotificationService.enqueueSnackbar(t("Text copied"));
};

const legacyCopy = (value: string) => {
   const ta = document.createElement("textarea");
   ta.value = value ?? "";
   ta.style.position = "absolute";
   ta.style.opacity = "0";
   document.body.appendChild(ta);
   ta.select();
   document.execCommand("copy");
   ta.remove();
};

export const verifyPortRange = (value, event = () => {}) => {
   const result = +value > 0 && +value <= 65535;
   // if (!result) return result;
   event();
   return result;
};

export const sortObject = (obj: unknown, asc: unknown) =>
   Object.keys(obj)
      .sort((a: unknown, b: unknown) => ((asc ? a > b : a < b) ? 1 : -1))
      .reduce((accumulator, key) => {
         accumulator[key] = obj[key];
         return accumulator;
      }, {});

export const sortArray = (arr: string[], asc = true) => {
   const result = arr.sort((a, b) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a > b) return 1;
      if (b > a) return -1;
      return 0;
   });
   if (!asc) result.reverse();
   return result;
};

export const getFileType = (file: File) => file.name.split(".").at(-1);

export const isIpTypeRange = (ip: string): boolean => /-/.test(ip);

export const ipToInteger = (ip: string): number => {
   const d = ip.split(".");
   return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
};

export const isIpInRange = (ip1: string, ip2: string, cameraIp: string) => {
   const [cameraIpInt, ipStartInt, ipEndInt] = [cameraIp, ip1, ip2].map(ipToInteger);
   return cameraIpInt >= ipStartInt && cameraIpInt <= ipEndInt;
   // return true if cameraIp is in range
};
export const isIpInList = (value: string, ipList: string[]): boolean =>
   ipList?.some(element => {
      if (element.includes("-")) {
         const [start, end] = element.split("-");
         return start === value || end === value;
      }
      return element === value;
   });

// mockDataAsync = async (data: unknown) =>
//   new Promise((resolve, reject) => {
//      setTimeout(() => {
//         resolve(data);
//      }, 500);
//   });

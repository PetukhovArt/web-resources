import { history } from "@/app/history";
import { NETWORK_TIMEOUT } from "@/constants";
import type { CancellablePromise } from "@/types";
import { isDevelopment } from "@/utils/common";
import axios, { type AxiosRequestConfig, type Canceler } from "axios";
import { t } from "i18next";
import _ from "underscore";
import { z } from "zod";
import i18n from "../i18n";
import NotificationService from "../service/NotificationService";

axios.interceptors.request.use(
   config => {
      const token = sessionStorage.getItem("token"); // добавляем токен
      const skipToken = config.headers.skipToken && config.headers.skipToken === "true";
      if (skipToken || !token) return config;
      if (!token) {
         return {
            ...config,
            status: 401,
            cancelToken: new axios.CancelToken(cancel => cancel("no token data")),
         };
      }
      const headers = {
         ...config.headers,
         token,
      };
      return {
         ...config,
         headers,
      };
   },
   error => Promise.reject(error),
);

// Add a response interceptor
axios.interceptors.response.use(
   response =>
      // Do something with response data
      response,
   error => {
      if ("response" in error) {
         switch (error.response.status) {
            case 401:
               localStorage.removeItem("token");
               break;
            default:
               break;
         }
      }
      return Promise.reject(error);
   },
);

// const manager = ConcurrencyManager(axios, MAX_CONCURRENT_REQUESTS)

export class BaseApi {
   private static CancellationMap = new Map<string, Canceler>();

   static Cancel(cancellationUuid: string) {
      const canceler = BaseApi.CancellationMap.get(cancellationUuid);
      if (_.isFunction(canceler)) {
         canceler();
      }
   }

   static modifyConfig(config: AxiosRequestConfig) {
      const token = sessionStorage.getItem("token"); // добавляем токен
      if (!token) return config;
      return {
         ...config,
         headers: {
            token,
         },
      };
   }

   static handleError(error) {
      switch (error.status) {
         case 400:
            NotificationService.enqueueSnackbar(i18n.t("Some error occured"), "error");
            break;
         case 401:
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            import.meta.env.PROD
               ? import("../service/auth/AuthProvider").then(AuthProvider => {
                    AuthProvider.default.clearUserData();
                 })
               : sessionStorage.removeItem("token");
            history.push("/");
            break;
         case 403:
            switch (error.data.message) {
               case "Configuration modification not allowed":
                  NotificationService.enqueueSnackbar(
                     i18n.t("Configuration modification not allowed"),
                     "error",
                  );
                  break;
               default:
                  break;
            }
            break;
         case 500:
            NotificationService.enqueueSnackbar(i18n.t("Server is not available!"), "error");
            break;
         default:
            break;
      }
   }

   static controller = new AbortController();

   static handleZodError(res: any, schema: z.ZodSchema<any>) {
      try {
         return schema.parse(res.data); // Parse response data with schema
      } catch (e) {
         if (e instanceof z.ZodError && e.issues.length > 0) {
            const error = e.issues[0];
            NotificationService.enqueueSnackbar(
               `Zod TypeGuard error: 
      path : ${error.path && error.path.length ? error.path : "invalid object"},
       expected : ${error && "expected" in error ? error.expected : ""},
       received : ${error && "received" in error ? error.received : ""},
       `,
               "error",
               15000,
            );
            console.error("Zod TypeGuard errors : ", e.issues);
         }
      }
   }

   /**
    * Makes an HTTP request and returns a promise.
    *
    * @template Result - The expected type of the response data.
    *
    * @param {AxiosRequestConfig} config - The Axios request configuration, to abort request :
    * put "timeout" prop to cancel request on timeout (cause high await time)
    * put "signal" prop to request and use cancelQueries in useEffect cleanup (see Push.tsx cancellation chain)
    * @param {Object} options - An object containing various options for the request
    * @param {boolean} [options.skipToken=false] - Whether to skip the authorization token.
    * @param {boolean} [options.resolveResponseData=true] - Whether to resolve the response data.
    * @param {boolean} [options.useTimeout=config.method.toUpperCase() === 'GET'] - Whether to use a timeout.
    * @param {boolean} [options.handleStatus=true] - Whether to handle the status.
    * @param {z.ZodSchema<any> | null} [options.schema=null] - The Zod schema to parse the response data for type compare,
    * throws error in dev mode if type error exists.
    *
    * @returns {CancellablePromise<Result>} - A cancellable promise that resolves with the response data.
    */
   static Request<Result>(
      config: AxiosRequestConfig,
      options: {
         skipToken?: boolean;
         resolveResponseData?: boolean;
         useTimeout?: boolean;
         handleStatus?: boolean;
         schema?: z.ZodSchema<any> | null;
      } = {},
   ): CancellablePromise<Result> {
      const cancellationUuid = Date.now().toString();
      config.cancelToken = new axios.CancelToken(cb => {
         BaseApi.CancellationMap.set(cancellationUuid, cb);
      });

      // default options values
      const {
         skipToken = false,
         resolveResponseData = true,
         useTimeout = config.method.toUpperCase() === "GET",
         handleStatus = true,
         schema = null,
      } = options;

      const source = axios.CancelToken.source();
      config.cancelToken = source.token;

      if (config.signal) {
         config.signal.addEventListener("abort", () => {
            source.cancel("Operation canceled by the user.");
         });
      }

      if (skipToken) {
         config = { ...config, headers: { skipToken: true } };
      }
      if (useTimeout) {
         config.timeout = config.timeout ? config.timeout : NETWORK_TIMEOUT;
      }
      const promise = axios(config)
         .then(res => {
            if (handleStatus) {
               // TODO: handleResponse( res );
            }
            if (schema && isDevelopment()) {
               return this.handleZodError(res, schema);
            }
            return resolveResponseData ? res.data : res;
         })
         .catch(err => {
            if (handleStatus) {
               switch (err.code) {
                  case "ECONNABORTED":
                     NotificationService.enqueueSnackbar(t("Operation timeout"), "error");
                     break;

                  default:
                     break;
               }
            }
            if (!axios.isCancel(err)) {
               const error = err.response;
               if (error && "status" in error) this.handleError(error);
               console.error(err);
            }
            throw err;
         });

      // @ts-ignore
      promise.cancellationUuid = cancellationUuid;
      return promise;
   }
}

import { BaseApi } from "src/api/BaseApi";

export default class API extends BaseApi {
   static loadExit(gpioNumber: number) {
      return this.Request<unknown>(
        {
           method: "GET",
           url: `/API/gpio${gpioNumber}/out`,
        },
        // { schema: ExitSchema },
      );
   }

}

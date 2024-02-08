import MotionService from "@/service/alarm/MotionService";
import { generateWsUrl } from "@/utils/common";
import CameraService from "./CameraService";
import PtzService from "./PtzService";

class SocketNotifierService {
   keepAliveInterval = null;

   keepAlive: "ok";

   ws: WebSocket = null;

   static connectionPath = "/API/Notifier";

   init() {
      const url = generateWsUrl(SocketNotifierService.connectionPath);
      const token = sessionStorage.getItem("token");
      this.ws = new WebSocket(url, token);
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onerror = this.onError.bind(this);
   }

   stop() {
      this.ws.close();
   }

   startKeepAlive() {
      this.keepAliveInterval = setInterval(() => {
         this.ws.send(JSON.stringify({ keepAlive: "true" }));
      }, 5000);
   }

   stopKeepAlive() {
      clearInterval(this.keepAliveInterval);
   }

   onOpen(e) {
      this.startKeepAlive();
   }

   onMessage(e) {
      const json = JSON.parse(e.data);
      switch (json.type) {
         case "dateTime":
            CameraService.updateDateTime(json.data);
            break;
         case "motionDetect":
            MotionService.handleMotionState(json.data);
            break;
         case "zoom":
            PtzService.setZoomStatus(json.data);
            break;
         case "focus":
            PtzService.setFocusStatus(json.data);
            break;
         default:
            break;
      }
   }

   onClose(e) {
      this.stopKeepAlive();
   }

   onError(e) {
      this.stopKeepAlive();
   }
}

export default new SocketNotifierService();

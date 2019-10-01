// import io from 'socket.io-client';
import { Dispatch } from "redux";
import io from "socket.io-client";
import getDeviceName, { getDeviceDescription } from "utils/deviceName";
import Registry from "../base/Registry";
import LocalStorageStore, { DEVICE_KEY } from "stores/LocalStorageStore";
/**
 * handles all communications via sockets to the backend
 * 
 * @export
 * @class SocketService
 */
class SocketService {
  /**
   *  the main socket instance for this client
   *
   * @type {SocketIOClient.Socket}
   * @memberof SocketService
   */
  socket: SocketIOClient.Socket;
  /**
   *Creates an instance of SocketService.

   * @param {Dispatch} dispatch dispatch changes to redux store
   * @memberof SocketService
   */
  constructor(private dispatch: Dispatch) {
    this.socket = io("http://localhost:3031", { path: "/ws" });
    this.initSocketEvents()
  }

  private initSocketEvents() {
    // upon connection, register device to the api
    this.socket.on("connected", _ => {
        this.socket.emit("device_mount", {
            mac_address: '02:42:f6:fe:a9:8c',
            name: getDeviceName(),
            description: getDeviceDescription()
          });
      });

    this.socket.on("data", data => {
        const deviceId = data.content.payload.deviceId;
        LocalStorageStore.put(DEVICE_KEY, deviceId)        
    })
  }

  // send a notification to the server
  sendNotification(message: string) {
      this.dispatch({type: 'notification', message})
  }
}

const initSocketService = (dispatch): SocketService => Registry.create(new SocketService(dispatch), SocketService.name)

export default initSocketService



import { Injectable } from '@angular/core';
import { Session, OpenVidu, StreamManager, } from 'openvidu-browser';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor() { }
  my_user_id = '';
  my_user_name = '';
  socket: SocketIOClient.Socket;
  // OpenVidu objects
  session: Session;
  OV: OpenVidu;
  publisher: StreamManager; // Local
  subscribers: StreamManager[] = []; // Remotes

  setUser(id, name) {
      this.my_user_id = id;
      this.my_user_name = name;
  }
  setSocket(socket) {
    this.socket = socket;
  }

}

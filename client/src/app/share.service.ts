import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor() { }
  my_user_id = '';
  my_user_name = '';
  socket: SocketIOClient.Socket;


  setUser(id, name) {
      this.my_user_id = id;
      this.my_user_name = name;
  }
  setSocket(socket) {
    this.socket = socket;
  }

}

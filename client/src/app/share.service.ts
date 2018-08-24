import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(
    private _httpService: HttpService
  ) { }
  my_user_id = '';
  my_user_name = '';
  socket: SocketIOClient.Socket;
  ytvideo_id = '';
  // exported_texts = [];


  setUser(id, name) {
      this.my_user_id = id;
      this.my_user_name = name;
  }
  setSocket(socket) {
    this.socket = socket;
  }
  setYT(id) {
    this.ytvideo_id = id;
  }
  // addText(word) {
  //   const curr_time = new Date();
  //   const observable = this._httpService.getTranslation(word, 'en', 'ko');
  //   observable.subscribe(data => {
  //     this.exported_texts.push(curr_time.getHours() + ':' + curr_time.getMinutes() + ' (draw) ' +
  //      data['data']['translations'][0]['translatedText'])
  //   })
  // }

}

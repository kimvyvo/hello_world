import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../http.service';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
  input_message = '';
  current_session_id = '';
  constructor(
    private _httpService: HttpService,
    private _shareService: ShareService,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.parent.params.subscribe((params: Params) => {
      console.log(params);
      this.current_session_id = params.id;
      this._shareService.socket.emit('init_text');
      this._shareService.socket.on('receive_text', () => {
        this.updateChatBox();
      });
    });
  }
  sendText() {
    const observable = this._httpService.getSingleSession(this.current_session_id);
    observable.subscribe((data: any) => {
      console.log('Got a single session. Result:', data);
      const new_msg = data.data.chat_content + '<p>' + this._shareService.my_user_name + ' --- ' + this.input_message + '</p>';
      const observable2 = this._httpService.editSession(this.current_session_id, {chat_content: new_msg});
      observable2.subscribe((data2: any) => {
        console.log('Updated session. Result:', data2);
        this._shareService.socket.emit('send_text');
        this.input_message = '';
      });
    });
  }
  updateChatBox() {
    const observable = this._httpService.getSingleSession(this.current_session_id);
    observable.subscribe((data: any) => {
      console.log('Got a single session. Result:', data);
      document.getElementById('chat_box').innerHTML = data.data.chat_content;
    });
  }
}

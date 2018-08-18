import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  error_create = '';
  error_join = '';
  all_sessions = [];
  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.getSessionsFromService();
  }
  getSessionsFromService() {
    const observable = this._httpService.getSessions();
    observable.subscribe((data: any) => {
      console.log('Got all sessions. Result:', data);
      this.all_sessions = data.data;
    });
  }
  addSessionFromService() {
    const observable = this._httpService.addSession({ title: 'Chat Room' });
    observable.subscribe((data: any) => {
      console.log('Added a session. Result:', data);
      this.getSessionsFromService();
    });
  }

}

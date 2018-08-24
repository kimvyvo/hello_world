import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  session_id = '';
  create_name = '';
  all_sessions = [];
  constructor(
    private _httpService: HttpService,
    private _router: Router,
    private _shareService: ShareService) { }

  ngOnInit() { }
  getSingleSessionFromService(id) {
    const observable = this._httpService.getSingleSession(id);
    observable.subscribe((data: any) => {
      console.log('Got a session. Result:', data);
    });
  }
  createSession() {
    const observable = this._httpService.addSession({ title: 'Chat Room' });
    observable.subscribe((data: any) => {
      console.log('Added a session. Result:', data);
      const observable2 = this._httpService.addUser(data.data[data.data.length - 1]._id, {name: this.create_name});
      observable2.subscribe((data2: any) => {
        console.log('Added a user. Result:', data2);
        this._shareService.setUser(data2.data._id, this.create_name);
        this._router.navigate(['/dashboard/' + data.data[data.data.length - 1]._id + '/welcome']);
      });
    });
  }
  showCreatePrompt() {
    const name = prompt('Please enter your name');
    if (name != null) {
      if (name === '') {
        alert('Name cannot be blank');
      } else {
        this.create_name = name;
        this.createSession();
      }
    }
  }
  joinSession() {
    const observable = this._httpService.getSingleSession(this.session_id);
    observable.subscribe((data: any) => {
      console.log(data);
      if (data.data == null) {
        alert('No session with this ID was found');
      } else {
        const name = prompt('Please enter your name');
        if (name != null) {
          if (name === '') {
            alert('Name cannot be blank');
          } else {
            const observable2 = this._httpService.addUser(this.session_id, {name: name});
            observable2.subscribe((data2: any) => {
              console.log('Data2?', data2);
              this._shareService.setUser(data2.data._id, data2.data.name);
              this._router.navigate(['/dashboard/' + this.session_id + '/welcome']);
            });
          }
        }
      }
    });
  }
  showJoinPrompt() {
    const session = prompt('Plase enter the session id');
    if (session != null) {
      if (session === '') {
        alert('Session ID cannot be blank');
      } else {
        this.session_id = session;
        this.joinSession();
      }
    }
  }
}

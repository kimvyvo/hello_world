import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  session_id = '';
  all_sessions = [];
  constructor(private _httpService: HttpService, private _router: Router) { }

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
      this._router.navigate(['/dashboard/' + data.data[data.data.length - 1]._id ]);
    });
  }
  showCreatePrompt() {
    const session = prompt('Please enter your name');
    if (session != null) {
      if (session === '') {
        alert('Name cannot be blank');
      } else {
        this.createSession();
      }
    }
  }
  joinSession() {
    const observable = this._httpService.getSingleSession(this.session_id);
    observable.subscribe((data: any) => {
      console.log(data);
      if (data.error) {
        alert('No session with this ID was found');
      } else {
        this._router.navigate(['/dashboard/' + this.session_id ]);
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

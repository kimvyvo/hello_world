import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { ShareService } from '../share.service';
import * as io from 'socket.io-client';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  all_translations = [];
  all_exports = '';
  socket: SocketIOClient.Socket;
  selected_session = '';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService,
    private _shareService: ShareService
  ) { this.socket = io.connect(); }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.leaveSite();
  }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.selected_session = params.id;
      this._shareService.setSocket(this.socket);
      this.socket.emit('new_user', {id: this._shareService.my_user_id, sid: params.id});
      console.log(this._shareService.my_user_id);
      // this._shareService.socket.on('new_export_is_here', () => {
      //   this.all_exports = this._shareService.exported_texts;
      // });
    });
  }

  leaveSite() {
    this.socket.disconnect();
    this._router.navigate(['/']);
  }

  download(filename, text) {
    const dwld = confirm('Download the transcript?');
    if (dwld) {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }


  //   // console.log("in here");
  //   MyController($scope, download) {
  //     $scope.downloadFile = function() {
  //         download.fromData('contents of the file', 'text/plain', 'file.txt');
  //     };
  //   }


  // leaveSite() {
  //   const observable = this._httpService.deleteUser(this._shareService.my_user_id, this.selected_session);
  //   observable.subscribe((data: any) => {
  //     console.log('Deleted a user. Result:', data);
  //     const observable2 = this._httpService.getSingleSession(this.selected_session);
  //     observable2.subscribe((data2: any) => {
  //       console.log(data2.data.users);
  //       if (data2.data.users.length === 0) {
  //         const observable3 = this._httpService.deleteSession(this.selected_session);
  //         observable3.subscribe((data3: any) => {
  //           console.log('Deleted a session. Result:', data3);
  //           this.socket.disconnect();
  //         });
  //       } else {
  //         this.socket.disconnect();
  //       }
  //     });
  //   });
  // }
}

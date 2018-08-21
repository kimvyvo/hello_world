import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  mediaConstraints = {
    audio: true,
    video: true
  };
  socket: SocketIOClient.Socket;
  constructor() { this.socket = io.connect(); }

  ngOnInit() {
    this.displayVideo();
    this.socket.on('receive_video', function(data) {
      document.getElementById('received_videos').innerHTML +=
        '<video id="received_video_'  + String(data.count) +  '" autoplay></video>';
      console.log(document.getElementById('received_videos').innerHTML);
      const video: HTMLMediaElement = (<HTMLMediaElement>document.getElementById('received_video_' + String(data.count)));
      video.srcObject = data.video;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    });
  }
  displayVideo() {
    navigator.mediaDevices.getUserMedia(this.mediaConstraints)
    .then(mediaStream => {
      const video: HTMLMediaElement = (<HTMLMediaElement>document.getElementById('local_video'));
      video.muted = true;
      // this.socket.emit('send_video', {video: mediaStream});
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) {
      console.log('An error occured when streaming video. Details:', err);
    });
  }

}

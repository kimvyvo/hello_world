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
    this.socket.emit('test_event', {msg: 'Plase work...'});
  }
  displayVideo() {
    navigator.mediaDevices.getUserMedia(this.mediaConstraints)
    .then(function(mediaStream) {
      const video = document.querySelector('video');
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

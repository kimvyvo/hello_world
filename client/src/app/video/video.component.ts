import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
    this.displayVideo();
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
      console.log('An error occured when streaming video.');
    });
  }
}

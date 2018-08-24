import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../http.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as $ from 'jquery';
import * as annyang from 'annyang';


@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {
  id = 'VcWWYdjePHE';

  speech_content = [];
  is_recording = true;
  
  private player;
  private ytEvent;


  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _dashboard: DashboardComponent,
  ) { }
  ngOnInit() { }
  yt_search() {
    console.log(this.id);
  }
  refresh() {
    location.reload();
  }
  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }
  startRecording() {
    if (annyang) {
      annyang.start({continuous: false });
      annyang.setLanguage(this._dashboard.lang_setting.lang_spoken);
      console.log(this._dashboard.lang_setting.lang_spoken, this._dashboard.lang_setting.lang_to);
      annyang.addCallback('result', (phrases) => {
        console.log('in the function', phrases);
        if (this.speech_content.length >= 1 && this.speech_content[this.speech_content.length-1] === encodeURI(phrases[0])) {
          console.log('do nothing');
        } else {
          this.speech_content.push(encodeURI(phrases[0]));
        }
        console.log(this.speech_content);
      });
    }
  }
  stopRecording() {
    console.log('stopped');
    annyang.abort();
    const curr_time = new Date();
    const source_lang = this._dashboard.lang_setting.lang_spoken.split('-')[0];
    let input_words = '';
    for (const word of this.speech_content) {
      input_words += word + '.';
    }
    console.log(input_words);
    const observable = this._httpService.getTranslation(input_words, source_lang, this._dashboard.lang_setting.lang_to);
    observable.subscribe(data => {
      if (data['data']['translations'][0]['translatedText']) {
        console.log(data['data']['translations'][0]['translatedText']);
        this._dashboard.all_translations.push([data['data']['translations'][0]['translatedText'],
        curr_time.toLocaleTimeString() + ' (video)']);
      }
      console.log('data is', data);
    });
    this.speech_content = [];
    return;
  }


  












  // startRecording() {
  //   if (annyang) {
  //     annyang.start({continuous: false });
  //     annyang.setLanguage(this.lang_setting.lang_spoken);
  //     console.log(this.lang_setting.lang_spoken, this.lang_setting.lang_to);
  //     annyang.addCallback('result', (phrases) => {
  //       console.log("in the function", phrases)
  //       this.speech_content = phrases[0];
  //     //   if (this.is_recording == false) {
  //     //     annyang.pause();
  //     //     const curr_time = new Date();
  //     //     var source_lang = this.lang_setting.lang_spoken.split('-')[0];
  //     //     let input_word = encodeURI(this.speech_content);
  //     //     console.log('this is source lang',source_lang);
  //     //     let observable = this._httpService.getTranslation(input_word,source_lang,this.lang_setting.lang_to);
  //     //     observable.subscribe(data=> {
  //     //       if (data['data']['translations'][0]['translatedText']) {
  //     //         console.log(data['data']['translations'][0]['translatedText']);
  //     //         var curr_minutes = curr_time.getMinutes();
  //     //         if (curr_time.getMinutes() < 9) {

  //     //         }
  //     //         this._dashboard.all_translations.push([data['data']['translations'][0]['translatedText'], curr_time.getHours() + ':' + curr_time.getMinutes()]);
  //     //         this.speech_content = '';
  //     //       }
  //     //       console.log('data is',data);
  //     //     });
  //     //     // this._dashboard.all_translations.push([this.speech_content, curr_time.getHours() + ':' + curr_time.getMinutes()]);
  //     //     this.speech_content = '';
  //     //     this.is_recording = true;
  //     //     return
  //     //   } 
  //     });

  //   }
  // }
  // stopRecording() {
  //   console.log('stopped');
  //   annyang.pause();
  //   const curr_time = new Date();
  //   const source_lang = this.lang_setting.lang_spoken.split('-')[0];
  //   const input_word = encodeURI(this.speech_content);
  //   console.log('this is source lang',source_lang);
  //   const observable = this._httpService.getTranslation(input_word,source_lang,this.lang_setting.lang_to);
  //   observable.subscribe(data=> {
  //     if (data['data']['translations'][0]['translatedText']) {
  //       console.log(data['data']['translations'][0]['translatedText']);
  //       // var curr_minutes = curr_time.getMinutes();
  //       // if (curr_time.getMinutes() < 9) {
  //       //   curr_minutes = '0' + curr_minutes
  //       // }
  //       this._dashboard.all_translations.push([data['data']['translations'][0]['translatedText'],
  //         curr_time.toLocaleTimeString() + ' (watch)']);
  //       this.speech_content = '';
  //     }
  //     console.log('data is', data);
  //   });
  //     // this._dashboard.all_translations.push([this.speech_content, curr_time.getHours() + ':' + curr_time.getMinutes()]);
  //   this.speech_content = '';
  //   this.is_recording = true;
  //   return;
  // }
}

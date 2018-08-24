import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { HttpService } from '../http.service';
import { ShareService } from '../share.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as $ from 'jquery';
import * as annyang from 'annyang';


@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {
  id: any;

  speech_content = [];
  is_recording = true;

  private player;
  private ytEvent;

  lang_list = [
    ['Afrikaans', 'af'],
    ['Arabic (Egypt)', 'ar-EG'],
    ['Arabic (Jordan)', 'ar-JO'],
    ['Arabic (Kuwait)', 'ar-KW'],
    ['Arabic (Lebanon)', 'ar-LB'],
    ['Arabic (Qatar)', 'ar-QA'],
    ['Arabic (UAE) ', 'ar-AE'],
    ['Arabic (Morocco)', 'ar-MA'],
    ['Arabic (Iraq)', 'ar-IQ'],
    ['Arabic (Algeria)', 'ar-DZ'],
    ['Arabic (Bahrain)', 'ar-BH'],
    ['Arabic (Lybia)', 'ar-LY'],
    ['Arabic (Oman)', 'ar-OM'],
    ['Arabic (Saudi Arabia)', 'ar-SA'],
    ['Arabic (Tunisia)', 'ar-TN'],
    ['Arabic (Yemen) ', 'ar-YE'],
    ['Basque', 'eu'],
    ['Bulgarian', 'bg'],
    ['Catalan', 'ca'],
    ['Chinese (Mandarin)', 'zh-CN'],
    ['Malaysian', 'zh-CN'],
    ['Chinese(Traditional Taiwan)', 'zh-TW'],
    ['Chinese (Simplified Hong Kong)', 'zh-HK'],
    ['Chinese (Yue: Traditional Hong Kong)', 'zh-yue'],
    ['Czech', 'cs'],
    ['Dutch', 'nl-NL'],
    ['English (Australia)', 'en-AU'],
    ['English (Canada)', 'en-CA'],
    ['English (India)', 'en-IN'],
    ['English(New Zealand)', 'en-NZ'],
    ['English(South Africa)', 'en-ZA'],
    ['English(United Kingdom)', 'en-GB'],
    ['English(United States)', 'en-US'],
    ['Finnish', 'fi'],
    ['French', 'fr-FR'],
    ['Galician', 'gl'],
    ['German', 'de-DE'],
    ['Greek', 'el-GR'],
    ['Hebrew', 'he'],
    ['Hungarian', 'hu'],
    ['Icelandic', 'is'],
    ['Italian', 'it-IT'],
    ['Japanese', 'ja'],
    ['Korean', 'ko'],
    ['Latin', 'la'],
    ['Malaysian', 'ms-MY'],
    ['Norwegian', 'no-NO'],
    ['Polish', 'pl'],
    ['Portuguese', 'pt-PT'],
    ['Portuguese (Brasil) ', 'pt-BR'],
    ['Romanian', 'ro-RO'],
    ['Russian', 'ru'],
    ['Serbian', 'sr-SP'],
    ['Slovak', 'sk'],
    ['Spanish(Argentina)', 'es-AR'],
    ['Spanish(Bolivia)', 'es-BO'],
    ['Spanish(Chile)', 'es-CL'],
    ['Spanish(Colombia)', 'es-CO'],
    ['Spanish(Costa Rica)', 'es-CR'],
    ['Spanish(Dominican Republic)', 'es-DO'],
    ['Spanish(Ecuador)', 'es-EC'],
    ['Spanish(El Salvador)', 'es-SV'],
    ['Spanish(Guatemala)', 'es-GT'],
    ['Spanish(Honduras)', 'es-HN'],
    ['Spanish(Mexico)', 'es-MX'],
    ['Spanish(Nicaragua)', 'es-NI'],
    ['Spanish(Panama)', 'es-PA'],
    ['Spanish(Paraguay)', 'es-PY'],
    ['Spanish(Peru)', 'es-PE'],
    ['Spanish(Puerto Rico)', 'es-PR'],
    ['Spanish(Spain)', 'es-ES'],
    ['Spanish(US)', 'es-US'],
    ['Spanish(Uruguay)', 'es-UY'],
    ['Spanish(Venezuela)', 'es-VE'],
    ['Swedish', 'sv-SE'],
    ['Turkish', 'tr-TR'],
    ['Zulu', 'zu']
  ];

  google_lang_list = [
    ['Afrikaans',	'af'],
    ['Albanian', 'sq'],
    ['Arabic', 'ar'],
    ['Azerbaijani', 'az'],
    ['Basque', 'eu'],
    ['Bengali',	'bn'],
    ['Belarusian', 'be'],
    ['Bulgarian', 'bg'],
    ['Catalan', 'ca'],
    ['Chinese Simplified', 'zh-CN'],
    ['Chinese Traditional', 'zh-TW'],
    ['Croatian', 'hr'],
    ['Czech', 'cs'],
    ['Danish', 'da'],
    ['Dutch',	'nl'],
    ['English',	'en'],
    ['Esperanto', 'eo'],
    ['Estonian', 'et'],
    ['Filipino', 'tl'],
    ['Finnish', 'fi'],
    ['French', 'fr'],
    ['Galician',	'gl'],
    ['Georgian',	'ka'],
    ['German', 'de'],
    ['Greek', 'el'],
    ['Gujarati', 'gu'],
    ['Haitian Creole', 'ht'],
    ['Hebrew', 'iw'],
    ['Hindi', 'hi'],
    ['Hungarian', 'hu'],
    ['Icelandic', 'is'],
    ['Indonesian', 'id'],
    ['Irish',	'ga'],
    ['Italian', 'it'],
    ['Japanese', 'ja'],
    ['Kannada', 'kn'],
    ['Korean', 'ko'],
    ['Latin', 'la']

  ];

  constructor(
    private _httpService: HttpService,
    private _shareService: ShareService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dashboard: DashboardComponent,
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this._router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         // trick the Router into believing it's last link wasn't previously loaded
         this._router.navigated = false;
         // if you need to scroll back to top, here is the right place
         window.scrollTo(0, 0);
      }
    });
  }
  ngOnInit() { }
  yt_search() {
    console.log(this.id);
    this._shareService.setYT(this.id);
    // this._router.navigate(['../../']);
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
        if (this.speech_content.length >= 1 && this.speech_content[this.speech_content.length - 1] === encodeURI(phrases[0])) {
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
  //     //         this._dashboard.all_translations.push([data['data']['translations'][0]['translatedText'],
  //     //         curr_time.getHours() + ':' + curr_time.getMinutes()]);
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

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

  lang_setting = {'lang_spoken': 'en-US', 'lang_to': 'ko'};
  lang_list = [['Afrikaans', 'af'],
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
  ['Zulu', 'zu']];

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
    ['Latin', 'la'],
    ['Latvian', 'lv'],
    ['Lithuanian', 'lt'],
    ['Macedonian', 'mk'],
    ['Malay', 'ms'],
    ['Norwegian', 'no'],
    ['Persian', 'fa'],
    ['Polish', 'pl'],
    ['Portuguese', 'pt'],
    ['Romanian', 'ro'],
    ['Russian', 'ru'],
    ['Serbian', 'sr'],
    ['Slovak', 'sk'],
    ['Slovenian', 'sl'],
    ['Spanish', 'es'],
    ['Swahili', 'sw'],
    ['Swedish', 'sv'],
    ['Tamil', 'ta'],
    ['Telugu', 'te'],
    ['Thai', 'th'],
    ['Turkish', 'tr'],
    ['Ukrainian', 'uk'],
    ['Urdu', 'ur'],
    ['Vietnamese', 'vi'],
    ['Welsh', 'cy'],
    ['Yiddish', 'yi']
  ];



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

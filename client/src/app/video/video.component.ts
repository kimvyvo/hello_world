import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ShareService } from '../share.service';
import { OpenVidu, Session, StreamManager, Publisher, Subscriber, StreamEvent } from 'openvidu-browser';
import * as annyang from 'annyang';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnDestroy {
  speech_content = '';
  lang_setting = {'lang_spoken': 'en-US', 'lang_to': 'ko-KR'};
  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';

  OV: OpenVidu;
  session: Session;
  publisher: StreamManager; // Local
  subscribers: StreamManager[] = []; // Remotes

  // Join form
  mySessionId: string;
  myUserName: string;
  lang_list = [['Afrikaans', 'af-ZA', ],
  ['Bahasa Indonesia', 'id-ID'],
  ['Bahasa Melayu',   'ms-MY'],
  ['Català',          'ca-ES'],
  ['Čeština',         'cs-CZ'],
  ['Deutsch',         'de-DE'],
  ['English (Australia)', 'en-AU'],
  ['English (Canada)', 'en-CA'],
  ['English (India)', 'en-IN'],
  ['English(New Zealand)', 'en-NZ'],
  ['English(South Africa)', 'en-ZA'],
  ['English(United Kingdom)', 'en-GB'],
  ['English(United States)', 'en-US'],
  ['Español(Argentina)', 'es-AR'],
  ['Español(Bolivia)', 'es-BO'],
  ['Español(Chile)', 'es-CL'],
  ['Español(Colombia)', 'es-CR'],
  ['Español(Ecuador)', 'es-EC'],
  ['Español(El Salvador)', 'es-SV'],
  ['Español(España)', 'es-ES'],
  ['Español(Estados Unidos)', 'es-US'],
  ['Español(Guatemala)', 'es-GT'],
  ['Español(Honduras)', 'es-HN'],
  ['Español(México)', 'es-MX'],
  ['Español(Nicaragua)', 'es-NI'],
  ['Español(Panamá)', 'es-PA'],
  ['Español(Paraguay)', 'es-PY'],
  ['Español(Perú)', 'es-PE'],
  ['Español(Puerto Rico)', 'es-PR'],
  ['Español(República Dominicana)', 'es-DO'],
  ['Español(Uruguay)', 'es-UY'],
  ['Español(Venezuela)', 'es-VE'],
  ['Euskara',         'eu-ES'],
  ['Français',        'fr-FR'],
  ['Galego',          'gl-ES'],
  ['Hrvatski',        'hr_HR'],
  ['IsiZulu',         'zu-ZA'],
  ['Íslenska',        'is-IS'],
  ['Italiano(Italia)', 'it-IT'],
  ['Italiano(Svizzera)', 'it-CH'],
  ['Magyar',          'hu-HU'],
  ['Nederlands',      'nl-NL'],
  ['Norsk bokmål',    'nb-NO'],
  ['Polski',          'pl-PL'],
  ['Português(Brasil)', 'pt-BR'],
  ['Português(Portugal)', 'pt-PT'],
  ['Română',          'ro-RO'],
  ['Slovenčina',      'sk-SK'],
  ['Suomi',           'fi-FI'],
  ['Svenska',         'sv-SE'],
  ['Türkçe',          'tr-TR'],
  ['български',       'bg-BG'],
  ['Pусский',         'ru-RU'],
  ['Српски',          'sr-RS'],
  ['한국어',            'ko-KR'],
  ['中文 (普通话 (中国大陆))', 'cmn-Hans-CN'],
  ['中文 (普通话 (香港))', 'cmn-Hans-HK'],
  ['中文 (中文 (台灣))', 'cmn-Hant-TW'],
  ['中文 (粵語 (香港))', 'yue-Hant-HK'],
  ['日本語',           'ja-JP'],
  ['Lingua latīna',   'la']];

  google_lang_list = [

  ];

  // Main video of the page, will be 'publisher' or one of the 'subscribers',
  // updated by an Output event of UserVideoComponent children
  @Input() mainStreamManager: StreamManager;

  constructor(
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _shareService: ShareService,
    private _httpService: HttpService) {
  }

  @HostListener('window:beforeunload')

  ngOnInit() {
    this._route.parent.params.subscribe((params: Params) => {
      console.log(this.OPENVIDU_SERVER_URL);
      this.session = this.session;
      this.publisher = this.publisher;
      this.subscribers = this.subscribers;
      this.mySessionId = params.id;
      this.myUserName = this._shareService.my_user_name;
      this.joinSession();
    });
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    // On window closed leave session
    this.leaveSession();
  }

  ngOnDestroy() {
    // On component destroyed leave session
    this.leaveSession();
  }

  joinSession() {

    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.session = this.OV.initSession();

    // --- 3) Specify the actions when events take place in the session ---

    // On every new Stream received...
    this.session.on('streamCreated', (event: StreamEvent) => {

      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
      this.subscribers.push(subscriber);
    });

    // On every Stream destroyed...
    this.session.on('streamDestroyed', (event: StreamEvent) => {

      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream.streamManager);
    });

    // --- 4) Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    this.getToken().then(token => {

      // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      this.session.connect(token, { clientData: this.myUserName })
        .then(() => {

          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          const publisher = this.OV.initPublisher(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true,     // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true,     // Whether you want to start publishing with your video enabled or not
            resolution: '640x480',  // The resolution of your video
            frameRate: 30,          // The frame rate of your video
            insertMode: 'APPEND',   // How the video is inserted in the target element 'video-container'
            mirror: false           // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---

          this.session.publish(publisher);

          // Set the main video in the page to display our webcam and store our Publisher
          this.mainStreamManager = publisher;
          this.publisher = publisher;
        })
        .catch(error => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
    });
  }

  leaveSession() {

    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    if (this.session) { this.session.disconnect(); }

    // Empty all properties...
    this.subscribers = [];
    delete this.publisher;
    delete this.session;
    delete this.OV;
  }

  private deleteSubscriber(streamManager: StreamManager): void {
    const index = this.subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private updateMainStreamManager(streamManager: StreamManager) {
    this.mainStreamManager = streamManager;
  }



  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * This method retrieve the mandatory user token from OpenVidu Server,
   * in this case making use Angular http API.
   * This behaviour MUST BE IN YOUR SERVER-SIDE IN PRODUCTION. In this case:
   *   1) Initialize a session in OpenVidu Server	 (POST /api/sessions)
   *   2) Generate a token in OpenVidu Server		   (POST /api/tokens)
   *   3) The token must be consumed in Session.connect() method of OpenVidu Browser
   */

  getToken(): Promise<string> {
    return this.createSession(this.mySessionId).then(
      sessionId => {
        return this.createToken(sessionId);
      });
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {

      const body = JSON.stringify({ customSessionId: sessionId });
      const options = {
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json'
        })
      };
      return this.httpClient.post(this.OPENVIDU_SERVER_URL + '/api/sessions', body, options)
        .pipe(
          catchError(error => {
            if (error.status === 409) {
              resolve(sessionId);
            } else {
              console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + this.OPENVIDU_SERVER_URL);
              if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + this.OPENVIDU_SERVER_URL +
                '\"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server' +
                'is up and running at "' + this.OPENVIDU_SERVER_URL + '"')) {
                location.assign(this.OPENVIDU_SERVER_URL + '/accept-certificate');
              }
            }
            return observableThrowError(error);
          })
        )
        .subscribe(response => {
          console.log(response);
          resolve(response['id']);
        });
    });
  }

  createToken(sessionId): Promise<string> {
    return new Promise((resolve, reject) => {

      const body = JSON.stringify({ session: sessionId });
      const options = {
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json'
        })
      };
      return this.httpClient.post(this.OPENVIDU_SERVER_URL + '/api/tokens', body, options)
        .pipe(
          catchError(error => {
            reject(error);
            return observableThrowError(error);
          })
        )
        .subscribe(response => {
          console.log(response);
          resolve(response['token']);
        });
    });
  }
  startRecording() {
    console.log('in here');
    if (annyang) {
      console.log('in anyang');
      annyang.addCallback('result', (phrases) => {
        this.speech_content = phrases[0];
        console.log(phrases);
      });
      // var commands = {
      //     'Hello': function() {
      //         alert('Hi! I can hear you.');
      //     }
      // };
      // annyang.addCommands(commands);
      annyang.start();

    }
  }
  stopRecording() {
    console.log('stopped');
    annyang.pause();
    const curr_time = new Date();
    this._httpService.all_content.push([this.speech_content, curr_time.getHours() + ':' + curr_time.getMinutes()]);
    this.speech_content = '';
  }


}

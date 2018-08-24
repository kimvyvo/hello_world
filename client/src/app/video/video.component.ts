import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ShareService } from '../share.service';
import { OpenVidu, Session, StreamManager, Publisher, Subscriber, StreamEvent } from 'openvidu-browser';
import * as annyang from 'annyang';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnDestroy {
  speech_content = [];
  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';

  OV: OpenVidu;
  session: Session;
  publisher: StreamManager; // Local
  subscribers: StreamManager[] = []; // Remotes

  // Join form
  mySessionId: string;
  myUserName: string;

  // Main video of the page, will be 'publisher' or one of the 'subscribers',
  // updated by an Output event of UserVideoComponent children
  @Input() mainStreamManager: StreamManager;

  constructor(
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _shareService: ShareService,
    private _dashboard: DashboardComponent,
    private _httpService: HttpService
    ) {
  }

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
    if (annyang) {
      annyang.start({continuous: false });
      annyang.setLanguage(this._dashboard.lang_setting.lang_spoken);
      console.log(this._dashboard.lang_setting.lang_spoken, this._dashboard.lang_setting.lang_to);
      annyang.addCallback('result', (phrases) => {
        console.log('in the function', phrases);
        this.speech_content.push(encodeURI(phrases[0]));
        
      //   if (this.is_recording == false) {
      //     annyang.pause();
      //     const curr_time = new Date();
      //     var source_lang = this.lang_setting.lang_spoken.split('-')[0];
      //     let input_word = encodeURI(this.speech_content);
      //     console.log('this is source lang',source_lang);
      //     let observable = this._httpService.getTranslation(input_word,source_lang,this.lang_setting.lang_to);
      //     observable.subscribe(data=> {
      //       if (data['data']['translations'][0]['translatedText']) {
      //         console.log(data['data']['translations'][0]['translatedText']);
      //         var curr_minutes = curr_time.getMinutes();
      //         if (curr_time.getMinutes() < 9) {

      //         }
      //         this._dashboard.all_translations.push([data['data']['translations'][0]['translatedText'],
      //         curr_time.getHours() + ':' + curr_time.getMinutes()]);
      //         this.speech_content = '';
      //       }
      //       console.log('data is',data);
      //     });
      //     // this._dashboard.all_translations.push([this.speech_content, curr_time.getHours() + ':' + curr_time.getMinutes()]);
      //     this.speech_content = '';
      //     this.is_recording = true;
      //     return
      //   }
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


}

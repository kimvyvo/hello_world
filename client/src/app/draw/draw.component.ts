import { Component, AfterViewInit, ViewChild,  ElementRef, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../http.service';
import { ShareService } from '../share.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as MyScriptJS from 'myscript';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements AfterViewInit {
  constructor(
    private _httpService: HttpService,
    private _shareService: ShareService,
    private _dashboard: DashboardComponent) { }
  @ViewChild('tref', {read: ElementRef}) domEditor: ElementRef;
  editor;
  ngAfterViewInit(): void {
    // your code
     console.log(this.domEditor.nativeElement);
     this.editor = MyScriptJS.register(this.domEditor.nativeElement, {
      recognitionParams: {
        type: 'TEXT',
        protocol: 'WEBSOCKET',
        apiVersion: 'V4',
        server: {
          scheme: 'https',
          host: 'webdemoapi.myscript.com',
          applicationKey: '4e867bfc-a2a3-4a31-92b4-4135141f65f9',
          hmacKey: 'fd7aa280-6cd1-48e0-915f-26c51638a11c',
        },
      },
    });
  }
  getExports() {
    // this.editor.export_((data) => {
    //   console.log(data);
    // });
    // this.txt = this.editor.export_();
    const curr_time = new Date();
    const observable3 = this._httpService.getTranslation(this.editor.model.exports['text/plain'],
      'en', this._dashboard.lang_setting.lang_to);
    observable3.subscribe(data => {
      this._dashboard.all_translations.push([data['data']['translations'][0]['translatedText'],
      curr_time.toLocaleTimeString() + ' (draw - ' + this._shareService.my_user_name + ')']);
    });
    // this._shareService.addText(this.editor.model.exports['text/plain']);
    // this._shareService.socket.emit('got_new_export');
  }

}

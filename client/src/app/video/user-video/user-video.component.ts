import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StreamManager } from 'openvidu-browser';

@Component({
    selector: 'app-user-video',
    styles: [`
        ov-video {
            width: 100%;
            height: auto;
            float: left;
            cursor: pointer;
        }
        div div {
            background: #f8f8f8;
            padding-left: 5px;
            padding-right: 5px;
            color: #777777;
            font-weight: bold;
            border-bottom-right-radius: 4px;
        }
        p {
            margin: 0;
        }`],
    template: `
        <div (click)="videoClicked()">
            <app-ov-video [streamManager]="streamManager"></app-ov-video>
            <div><p>{{getNicknameTag()}}</p></div>
        </div>`
})
export class UserVideoComponent {

    @Input()
    streamManager: StreamManager;

    @Output()
    clicked = new EventEmitter();

    getNicknameTag() { // Gets the nickName of the user
        return JSON.parse(this.streamManager.stream.connection.data).clientData;
    }

    videoClicked() { // Triggers event for the parent component to update its main video display (other UserVideoComponent)
        this.clicked.emit();
    }

}

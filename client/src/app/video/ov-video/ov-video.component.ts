import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { StreamManager } from 'openvidu-browser';

@Component({
    selector: 'app-ov-video',
    template: '<video #videoElement></video>'
})
export class OvVideoComponent implements AfterViewInit {

    @ViewChild('videoElement') elementRef: ElementRef;

    _streamManager: StreamManager;

    ngAfterViewInit() {
        this._streamManager.addVideoElement(this.elementRef.nativeElement);
    }

    @Input()
    set streamManager(streamManager: StreamManager) {
        this._streamManager = streamManager;
        if (!!this.elementRef) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
        }
    }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoComponent } from './video/video.component';
import { TextComponent } from './text/text.component';
import { DrawComponent } from './draw/draw.component';
import { WatchComponent } from './watch/watch.component';
import { ErrorComponent } from './error/error.component';

import { HttpService } from './http.service';
import { ShareService } from './share.service';

import {
    GoogleApiModule, 
    GoogleApiService, 
    GoogleAuthService, 
    NgGapiClientConfig, 
    NG_GAPI_CONFIG,
    GoogleApiConfig
} from "ng-gapi";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    VideoComponent,
    TextComponent,
    DrawComponent,
    WatchComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [HttpService, ShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
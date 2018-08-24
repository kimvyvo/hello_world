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
import { UserVideoComponent } from './video/user-video/user-video.component';
import { OvVideoComponent } from './video/ov-video/ov-video.component';

import { YoutubePlayerModule } from 'ngx-youtube-player';
import { YtvComponent } from './ytv/ytv.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    VideoComponent,
    TextComponent,
    DrawComponent,
    WatchComponent,
    ErrorComponent,
    UserVideoComponent,
    OvVideoComponent,
    YtvComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    YoutubePlayerModule,
  ],
  providers: [HttpService, ShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }

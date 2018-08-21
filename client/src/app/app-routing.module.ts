import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { VideoComponent } from './video/video.component';
import { TextComponent } from './text/text.component';
import { DrawComponent } from './draw/draw.component';
import { WatchComponent } from './watch/watch.component';
import { ErrorComponent } from './error/error.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'dashboard/:id', component: DashboardComponent, children: [
    { path: 'video', component: VideoComponent },
    { path: 'text', component: TextComponent },
    { path: 'draw', component: DrawComponent },
    { path: 'watch', component: WatchComponent }
  ] },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }


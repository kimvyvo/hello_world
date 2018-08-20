import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(
    private _title: Title
  ) {}

  ngOnInit() {
    // this._title.setTitle('Hello World!');
  }
}

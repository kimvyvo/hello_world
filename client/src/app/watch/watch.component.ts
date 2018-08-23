import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../http.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute
  ) { }
  ngOnInit() { }
  yt_search(){

  }
}

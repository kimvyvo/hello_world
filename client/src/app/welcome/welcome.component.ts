import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  
  constructor(
    private _shareService: ShareService,
  ) { }
  
  ngOnInit() {
    console.log (this._shareService.my_user_name)
  }

}

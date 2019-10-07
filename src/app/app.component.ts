import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  name = "I come from Parent"
  someData: any;
  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.autoAuthuser();
  }

  onRecieve(data){
    this.someData = data;
    console.log(this.someData);
  }

  checkTimeLeft(){
    let expire = new Date(localStorage.getItem('expiration'));
    let now = new Date();
    let expireIn = expire.getTime() - now.getTime();
    console.log(this.msToTime(expireIn));
    console.log(expire);
  }

  msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? 0 + hours : hours;
    minutes = (minutes < 10) ? 0 + minutes : minutes;
    seconds = (seconds < 10) ? 0 + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds;
  }
}

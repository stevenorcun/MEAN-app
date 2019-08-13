import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLogged = false;
  constructor() { }

  ngOnInit() {
  }

  onClickCheckLogged(){
    this.isLogged = !this.isLogged;
  }
}

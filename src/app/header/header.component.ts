import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userIsAuthenticated: boolean = false;
  private authlistenerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(){
    this.authlistenerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }
}

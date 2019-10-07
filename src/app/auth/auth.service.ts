  import { Injectable } from '@angular/core';
  import { HttpClient} from '@angular/common/http';
  import { AuthData } from './auth-data.model';
  import { Subject } from 'rxjs';
  import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken(){
    return this.token;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/users/signup', authData)
      .subscribe( response => {
        console.log(response);
      })
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expireIn: number, userId: string}>('http://localhost:3000/api/users/login', authData)
      .subscribe( response => {
        const token = response.token;
        this.token = token;
        if(token){
          const expirationDuration = response.expireIn;
          this.setTimer(expirationDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          this.saveAuthData(token, this.setExpirationdate(expirationDuration), this.userId);
          this.router.navigate(['/']);
        };
      })
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthuser(){
    const authInformation = this.getAuthData();
    // Dans le cas où user not auth
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expireIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem("token", token);
    // Les données sauvegardées en string dans le localstorage
    // pour les date => no toString() mais toISOString()
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private setTimer(timer: number){
    this.tokenTimer = setTimeout( () => {
      this.logout();
    }, timer * 1000);
  }

  private setExpirationdate(expirationDuration){
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expirationDuration * 1000);
    return expirationDate;
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration")
    const userId = localStorage.getItem("userId")
    if(!token || !expirationDate){
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    }
  }
}

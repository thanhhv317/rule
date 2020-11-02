import { Component } from '@angular/core';
import { AuthenticationService } from './services';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogin: Boolean = false;
  level : Boolean = false; // [1: Admin = true, 2: User = false]
  username: String;

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _cookieService: CookieService
  ) {
    this.isLogin = (this._cookieService.get('userToken')) ? true : false;
    this.username = this._cookieService.get('username') || '';
    this.level = (this._cookieService.get('userLevel') && this._cookieService.get('userLevel') === '1') ? true: false; 
    _authenticationService.changeEmitted$.subscribe(
      res => {
        this.isLogin = res.isLogin;
        this.username = res.username;
        this.level = res.level.toString() === '1' ? true: false;
        this._router.navigateByUrl('/');
      }
    )
    this.checkLogin()
  }

  checkLogin() {
    if (!this.isLogin) {
      let path = '/login';
      this._router.navigateByUrl(path);
    }
  }

  logout() {
    this.isLogin = false;
    this._cookieService.deleteAll('/');
    this.checkLogin();
  }
}

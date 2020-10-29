import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/interfaces';
import { AuthenticationService } from 'src/app/services';
import { CookieService } from 'ngx-cookie-service';
import { NotifierService } from "angular-notifier";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: UserLogin;
  private readonly _notifier: NotifierService;

  constructor(
    private _authenticationService: AuthenticationService,
    private _cookieService: CookieService,
    notifierService: NotifierService,
    private _router: Router,
  ) {
    this._notifier = notifierService;
    if (this._cookieService.get('userToken')) {
      this._router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.user = {
      username: null,
      password: null
    }
  }

  onChange(event: any) {
    let name = event.target.name;
    let value = event.target.value;
    this.user[name] = value;
  }

  login() {
    if (!this.user.username || !this.user.password) {
      this._notifier.notify('error', 'Username and Password is required');
      return;
    }
    this._authenticationService.login(this.user).subscribe(
      (res) => {
        this._cookieService.set('userToken', res.access_token);
        this._cookieService.set('username', res.username);
        this._cookieService.set('userLevel', res.level);
        this._notifier.notify("success", "Logged in successfully");
        // send data
        let data = {
          isLogin: true,
          username: res.username,
          level: res.level
        }
        this._authenticationService.emitChange(data);
      }, (err) => {
        this._notifier.notify("error", err.error.message);
      })
  }
}

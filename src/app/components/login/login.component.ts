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

  private readonly notifier: NotifierService;
  constructor(
    private authenticationService: AuthenticationService,
    private _cookieService: CookieService,
    notifierService: NotifierService,
    private router: Router,
  ) {
    this.notifier = notifierService;
    if (this._cookieService.get('userToken')) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.user = {
      username: '',
      password: ''
    }
  }

  onChange(event: any) {
    let name = event.target.name;
    let value = event.target.value;
    this.user[name] = value;
  }

  login() {
    this.authenticationService.login(this.user).subscribe(
      (res) => {
        this._cookieService.set('userToken', res.access_token);
        this._cookieService.set('username', res.username);
        this._cookieService.set('userLevel', res.level);
        this.notifier.notify("success", "Logged in successfully");
        // send data
        let data = {
          isLogin: true,
          username: res.username,
          level: res.level
        }
        this.authenticationService.emitChange(data);
      }, (err) => {
        this.notifier.notify("error", err.error.message);
      })
  }


}

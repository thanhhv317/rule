import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/interfaces';
import { AuthenticationService } from 'src/app/services';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: UserLogin;

  constructor(
    private authenticationService: AuthenticationService,
    private _cookieService: CookieService,
  ) { }

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
    this.authenticationService.login(this.user).subscribe((res) => {
      console.log(res);
      this._cookieService.set('userToken', res.access_token);
      this._cookieService.set('username', res.username);
      this._cookieService.set('userLevel', res.level);
      this.successLogin();
    }, (err) => {
      console.log(err.error.message)
    })
  }

  successLogin() {
    this.authenticationService.emitChange(true);
  }

}

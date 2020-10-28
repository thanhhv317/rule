import { Component } from '@angular/core';
import { AuthenticationService } from './services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogin: Boolean = false;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) {
    authenticationService.changeEmitted$.subscribe(
      text => {
        this.isLogin = text;
        this.router.navigateByUrl('/');
      }
    )
    this.checkLogin()
  }

  checkLogin() {
    if(!this.isLogin) {
      let path = '/login';
      this.router.navigateByUrl(path);
    }
  }
}

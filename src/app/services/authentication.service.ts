import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserLogin } from '../interfaces';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private emitChangeSource = new Subject<any>();
  notifier: NotifierService;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    notifierService: NotifierService,
    private _cookieService: CookieService
  ) {
    this.notifier = notifierService;
  }

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(data: any) {
    this.emitChangeSource.next(data);
  }

  public handleUserRoute() {
    if (this._cookieService.get('userLevel') === '2') {
      this._router.navigateByUrl('/');
      this.notifier.notify('error', 'You have not permission');
    }
    return
  }

  public handleLoginSessionExpires() {
    this._cookieService.deleteAll();
    this.notifier.notify('error', 'Login Session Expires!');
    this._router.navigateByUrl('/login');
  }

  public login(userLogin: UserLogin): Observable<any> {
    return this._httpClient.post('/auth/login', userLogin, this.httpOptions);
  }

}

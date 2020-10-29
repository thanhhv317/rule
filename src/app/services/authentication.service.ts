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
    private httpClient: HttpClient,
    private router: Router,
    notifierService: NotifierService,
    private _cookieService: CookieService
  ) {
    this.notifier = notifierService; }

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(data: any) {
    this.emitChangeSource.next(data);
  }

  public handleUserRoute(){
    if (this._cookieService.get('userLevel') === '2') {
      this.router.navigateByUrl('/');
      this.notifier.notify('error', 'You does not permission');
    }
    return 
  }

  public handleLoginSessionExpires() {
    this._cookieService.deleteAll();
    this.notifier.notify('error', 'Login Session Expires!');
    this.router.navigateByUrl('/login');
  }

  public login(userLogin: UserLogin): Observable<any> {
    return this.httpClient.post('/auth/login', userLogin, this.httpOptions);
  }

}

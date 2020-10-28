import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserLogin } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private emitChangeSource = new Subject<any>();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  public login(userLogin: UserLogin): Observable<any> {
    return this.httpClient.post('/auth/login', userLogin, this.httpOptions);
  }

}

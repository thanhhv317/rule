import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BackendRule } from '../interfaces/backendRule';
import { Rule } from '../interfaces/rule';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(
    private _httpClient: HttpClient,
    private _cookieService: CookieService
  ) { 
  }

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + this._cookieService.get('userToken')
    })
  };


  public addData(backendRule: BackendRule): Observable<BackendRule> {
    let body = {
      action: 'create',
      createRuleDTO: backendRule
    }
    return this._httpClient.post<BackendRule>('/rules', body, this.httpOptions).pipe(catchError(this.handleError));
  }

  public updateData(ruleId: string, rule: any): Observable<any> {
    let body = {
      action: 'update',
      ruleID: ruleId,
      createRuleDTO: rule
    }
    return this._httpClient.post('/rules', body, this.httpOptions);
  }

  public getRule(ruleId: any): Observable<Rule> {
    ruleId.action = 'get_rule';
    return this._httpClient.post<Rule>('/rules', ruleId, this.httpOptions);
  }

  public deleteRule(ruleID: string): Observable<any> {
    let obj = {
      action: 'delete',
      ruleID
    }
    return this._httpClient.post<Rule>('/rules', obj, this.httpOptions);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

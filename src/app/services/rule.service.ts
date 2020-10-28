import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BackendRule } from '../interfaces/backendRule';
import { Rule } from '../interfaces/rule';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  // private REST_API_SERVER = "http://localhost:4001";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  public addData(backendRule: BackendRule): Observable<BackendRule> {
    let body = {
      action: 'create',
      createRuleDTO: backendRule
    }
    return this.httpClient.post<BackendRule>('/rules', body, this.httpOptions).pipe(catchError(this.handleError));
  }

  public updateData(ruleId: string, rule: any): Observable<any> {
    let body = {
      action: 'update',
      ruleID: ruleId,
      createRuleDTO: rule
    }
    return this.httpClient.post('/rules', body, this.httpOptions);
  }

  public getRule(ruleId: any): Observable<Rule> {
    ruleId.action = 'get_rule';
    return this.httpClient.post<Rule>('/rules', ruleId, this.httpOptions);
  }

  public deleteRule(ruleID: string): Observable<any> {
    let obj = {
      action: 'delete',
      ruleID
    }
    return this.httpClient.post<Rule>('/rules', obj, this.httpOptions);
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
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

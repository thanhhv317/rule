import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rule } from './interfaces/rule';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private REST_API_SERVER = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  public addData(rule: Rule): Observable<Rule> {
    return this.httpClient.post<Rule>(this.REST_API_SERVER + '/rule/create', rule, this.httpOptions).pipe(catchError(this.handleError));
  }

  public updateData(ruleId: string, rule: any): Observable<any> {
    return this.httpClient.put(this.REST_API_SERVER + '/rule/update?ruleID=' + ruleId, rule, this.httpOptions);
  }

  public getRule(ruleId: string): Observable<Rule> {
    return this.httpClient.get<Rule>(this.REST_API_SERVER+'/rule/' + ruleId, this.httpOptions).pipe();
  }

  public deleteRule(ruleID: string): Observable<any> {
    return this.httpClient.delete<Rule>(this.REST_API_SERVER + '/rule?ruleID=' + ruleID, this.httpOptions);
  }

  public filterData(data: any) : Observable<any> {
    return this.httpClient.post(this.REST_API_SERVER+'/rule/filter', data, this.httpOptions).pipe(catchError(this.handleError));
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

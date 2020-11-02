import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { HistoryUpdate } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
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

    public addData(data: HistoryUpdate): Observable<HistoryUpdate> {
        let body = {
            action: 'create',
            data
        }
        return this._httpClient.post<HistoryUpdate>('/history', body, this.httpOptions);
    }

    public getHistory(ruleId: String): Observable<HistoryUpdate[]> {
        let body = {
            action: 'histories',
            ruleId
        };
        return this._httpClient.post<HistoryUpdate[]>('/history', body, this.httpOptions);
    }

}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import {Rule} from '../interfaces/rule';
const moment = require('moment');

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-server-side-angular-way',
  templateUrl: 'server-side-angular-way.component.html',
  styleUrls: ['server-side-angular-way.component.css']
})
export class ServerSideAngularWayComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  rules: Rule[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            'http://localhost:3000/rule/list',
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.rules = resp.data;
            that.rules[0].from = moment(that.rules[0].from).format('DD/MM/YYYY hh:mm')

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { data: '_id' }, 
        { data: 'name' }, 
        { data: 'description' },
        { data: 'from' },
        { data: 'to' },
        { data: 'status' }
      ]
    };
  }
}
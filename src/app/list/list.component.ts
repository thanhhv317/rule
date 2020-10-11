
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import {Rule} from '../interfaces/rule';
import * as moment from 'moment';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit {
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
            that.rules = [...resp.data];
            for(let i =0; i<that.rules.length;++i) {
              that.rules[i].from = moment(that.rules[i].from).format('hh:mm DD/MM/YYYY')
              that.rules[i].to = moment(that.rules[i].to).format('hh:mm DD/MM/YYYY')
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { data: 'name' }, 
        { data: 'description' },
        { data: 'from' },
        { data: 'to' },
        { data: 'status' }
      ]
    };
  }
}
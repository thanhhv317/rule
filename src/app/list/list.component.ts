
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Rule } from '../interfaces/rule';
import * as moment from 'moment';
import { remove } from 'lodash';

import { RuleService } from '../rule.service';
import { NotifierService } from "angular-notifier";


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
  tData: boolean = false;
  private readonly notifier: NotifierService;

  constructor(private http: HttpClient, private ruleService: RuleService, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.tData = true;
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
            for (let i = 0; i < that.rules.length; ++i) {
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

  onDelete(id: string): void {
    if (confirm("DO YOU WANT DELETE IT?")) {
      remove(this.rules, (rule) => rule._id===id);
      this.ruleService.deleteRule(id).subscribe((data: any) => {
        // console.log(data)
        this.notifier.notify("success", "Successfully deleted!");
      });
      
    } else {
      // to do
      this.notifier.notify("warning", "Cancel!");
    }
  }
}
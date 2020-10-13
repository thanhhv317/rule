import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rule } from '../interfaces/rule';
import * as moment from 'moment';
import { RuleService } from '../rule.service';
import { NotifierService } from "angular-notifier";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  start: number;
  length: number;
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

  public recordsTotal = 0;
  public recordsFiltered = 0;
  public start = 0;
  public length = 10;

  public status = [
    { name: "All", value: "ALL" },
    { name: "Active", value: "ACTIVE" },
    { name: "Inactive", value: "INACTIVE" },
    { name: "Delete", value: "DELETE" },
  ]

  public filterData = {
    start: this.start,
    length: this.length,
    from: '',
    to: '',
    status: 'ALL'
  }

  constructor( 
    private http: HttpClient, 
    private ruleService: RuleService, 
    notifierService: NotifierService
  ) {
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
      pageLength: 20,
      serverSide: true,
      dom: '<"top"f>rt<"bottom"lp><"clear">',
      processing: true,
      lengthMenu: [[20, 30, 50, 100], [20, 30, 50, 100]],
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            'http://localhost:3000/rule/list',
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.rules = [...resp.data];
            that.recordsTotal = resp.recordsTotal;
            that.recordsFiltered = resp.recordsFiltered;
            that.start = resp.start;
            that.length = resp.length;
            for (let i = 0; i < that.rules.length; ++i) {
              that.rules[i].from = moment(that.rules[i].from).format('hh:mm DD/MM/YYYY')
              that.rules[i].to = moment(that.rules[i].to).format('hh:mm DD/MM/YYYY')
            }
            callback({
              recordsTotal: that.recordsTotal,
              recordsFiltered: that.recordsFiltered,
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
      this.rules.map((rule) => {
        rule._id === id ? rule.status = "DELETE" : ''
      })
      this.ruleService.deleteRule(id).subscribe((data: any) => {
        this.notifier.notify("success", "Successfully deleted!");
      });
    } else {
      this.notifier.notify("warning", "Cancelled!");
    }
  }

  onChange(event: any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.filterData[nam] = val;
  }

  selectChangeHandler(event: any) {
    this.filterData.status = event.target.value.toUpperCase();
  }

  onSearch(): void {
    this.ruleService.filterData(this.filterData).subscribe((data: any) => {
      this.rules = [...data.data];
      this.rules.map((rule) => {
        rule.from = moment(rule.from).format('hh:mm DD/MM/YYYY')
        rule.to = moment(rule.to).format('hh:mm DD/MM/YYYY')
      })
    });
  }

}
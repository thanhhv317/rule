import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rule } from '../interfaces/rule';
import { BackendRule } from '../interfaces/backendRule';
import * as moment from 'moment';
import { RuleService } from '../rule.service';
import { NotifierService } from "angular-notifier";
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Status } from '../interfaces/status';

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

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  dtOptions: DataTables.Settings = {};
  rules: BackendRule[];
  tData: boolean = false;
  private readonly notifier: NotifierService;

  status: Status[];
  statusSeleted: string;

  public filterData = {
    name: '',
    type: '',
    from_date: null,
    to_date: null,
    status: 'ALL',
    priority: '',
  }

  constructor(
    private http: HttpClient,
    private ruleService: RuleService,
    notifierService: NotifierService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.notifier = notifierService;
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    this.status = [
      { name: "All", value: "ALL" },
      { name: "Active", value: "true" },
      { name: "Inactive", value: "false" },
    ];
    this.getData();

    this.statusSeleted = "ALL";
  }



  getData(): void {
    this.tData = true;
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      dom: '<"top"i>rt<"bottom"lp><"clear">',
      processing: true,
      lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
      ajax: (dataTablesParameters: any, callback) => {
        let tmp = { ...dataTablesParameters };
        tmp.filter = this.filterData;
        that.http
          .post<DataTablesResponse>(
            'http://localhost:3000/rule/list',
            tmp, {}
          ).subscribe(resp => {
            that.rules = [...resp.data];
            for (let i = 0; i < that.rules.length; ++i) {
              that.rules[i].from_date = Number(moment(that.rules[i].from_date))
              that.rules[i].to_date = Number(moment(that.rules[i].to_date))
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
        { data: 'type' },
        { data: 'from' },
        { data: 'to' },
        { data: 'status' },
        { data: 'priority' },
        { data: 'actions', searchable: false, orderable: false }
      ]
    };
  }

  onDelete(id: string): void {
    if (confirm("DO YOU WANT DELETE IT?")) {
      this.rules.map((rule) => {
        rule._id === id ? rule.active = false : ''
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
    this.filterData.status = event.target.value.replace(/[^a-zA-Z]/g, '');
  }

  formatDateTime(timestemp: number) {
    return moment(timestemp).format("DD/MM/YYYY - hh:mm A");
  }

  onFilter() {
    this.tData = false;
    this.filterData.from_date = this.convertNgbDate2String(this.fromDate);
    this.filterData.to_date = this.convertNgbDate2String(this.toDate);
    setTimeout(() => {
      this.getData();
    }, 100)
  }

  convertNgbDate2String(date: NgbDate | null): number {
    if(!date) return null;
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return moment(jsDate).valueOf();
  }

  addZero2Number(num: Number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  // datepicker

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}
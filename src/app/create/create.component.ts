import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { RuleService } from '../rule.service';
import { NotifierService } from "angular-notifier";
import { ActionType } from '../interfaces/actionType';
import { BackendRule } from '../interfaces/backendRule';
import * as moment from 'moment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public data: Object[];
  public importRules: RuleModel;
  public isAdd = true;

  private readonly notifier: NotifierService;

  public actionType: ActionType[];
  public listAction = [
    [
      { field: 'Event name', name: 'type' },
      { field: 'Path', name: 'path' },
      { field: 'Phí cố định', name: 'e_value_base' },
      { field: 'Phí %', name: 'e_value_rate' },
      { field: 'Giá trị lớn nhất', name: 'max_value' },
      { field: 'Giá trị nhỏ nhất', name: 'min_value' }
    ],
    [
      { field: 'Event name', name: 'type' },
      { field: 'Path', name: 'path' },
      { field: 'Phí cố định', name: 'e_value_base' }
    ],
    [],
    [
      { field: 'Event name', name: 'type' },
      { field: 'Path', name: 'path' },
      { field: 'Phí cố định', name: 'e_value_base' },
      { field: 'Phí %', name: 'e_value_rate' },
      { field: 'Giá trị lớn nhất', name: 'max_value' },
      { field: 'Giá trị nhỏ nhất', name: 'min_value' }
    ]
  ];
  public isFee: Boolean = false;
  public fee_type = [
    { value: 1, field: 'Phí dịch vụ' },
    { value: 2, field: 'Phí thanh toán' },
    { value: 3, field: 'Phí offline' },
  ];

  actionSelected: Array<any>;
  actionTypeSelected: string;
  feeTypeSelected: number;

  // data send: 
  r_type: string;
  public backendRule: BackendRule;
  status: boolean = true;

  event: Object;

  constructor(private ruleService: RuleService, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  @ViewChild('querybuilder')
  public qryBldrObj: QueryBuilderComponent;

  ngOnInit(): void {
    this.actionType = [
      { id: 1, name: 'bonus' },
      { id: 2, name: 'route' },
      { id: 3, name: 'restrict' },
      { id: 4, name: 'fee' }
    ];

    this.actionSelected = this.listAction[0];
    this.actionTypeSelected = 'bonus';
    this.r_type = 'bonus';
    this.feeTypeSelected = 1;

    this.backendRule = {
      fee_type: 1,
      to_date: 12,
      from_date: 0,
      priority: 1,
      active: true,
      name: '',
      description: '',
      type: this.r_type,
      event: '',
      conditions: ''
    };
    this.initEvent()
  }

  initEvent(): void {
    this.event = {
      type: '',
      path: '',
      e_value_base: 0,
      e_value_rate: 0,
      min_value: 0,
      max_value: 0,
    }
  }

  onChangeDateEj2(args, field) {
    console.log(args.value);
    console.log(moment(args.value).valueOf());
    this.backendRule[field] = moment(args.value).valueOf();
  }

  onChange4Event(event: any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.event[nam] = val;
  }

  selectChangeHandler(event: any) {
    this.r_type = event.target.value.replace(/[^a-zA-Z]/g, '');
    this.backendRule.type = this.r_type;
    this.actionSelected = this.listAction[Number(event.target.value.replace(/[^0-9]/g, ''))];
    if (this.r_type === 'fee') {
      this.isFee = true;
    } else {
      this.isFee = false;
    }

    if (this.r_type === 'restrict') {
      this.initEvent();
    }
  }

  selectFeeType(event: any) {
    this.feeTypeSelected = Number(event.target.value[3]);
  }

  onChange(event: any) { // without type info
    let nam = event.target.name;
    let val = event.target.value;
    if (nam === 'status') {
      this.status = val==="ACTIVE" ? true: false;
    }
    this.backendRule[nam] = val;
  }

  checkNull(field: any, message: string) {
    if (field) {
      this.notifier.notify("error", message);
      return true;
    }
    return false;
  }

  getValue(): void {
    let event = this.convertEvent(this.event);
    this.backendRule.event = event;
    this.backendRule.active = this.status;
    const conditions = this.parseConditions({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    // console.log(JSON.stringify(conditions));
    this.backendRule.conditions = JSON.stringify(conditions);
    console.log(this.backendRule);
    this.addData();
  }

  convertEvent(data: any): any {
    if (data.type === '') return {};
    return JSON.stringify({
      type: data.type,
      params: {
        path: data.path,
        e_value_base: data.e_value_base,
        e_value_rate: data.e_value_rate,
        min_value: data.min_value,
        max_value: data.max_value
      }
    })
  }

  parseConditions(data: any) {
    const result = {};
    const o = data.condition === "or" ? "any" : "all";
    result[o] = [];
    if (data.rules && data.rules.length) {
      result[o] = [];
      for (let i = 0; i < data.rules.length; i++) {
        if (data.rules[i].condition) {
          result[o][i] = this.parseConditions(data.rules[i]);
        } else {
          // check
          if (data.rules[i].value === undefined || data.rules[i].value === '') {
            this.notifier.notify("error", 'The conditions is not correct');
            this.isAdd = false;
            return;
          }
          this.isAdd = true;
          result[o][i] = {
            fact: data.rules[i].field,
            operator: data.rules[i].operator,
            value: data.rules[i].value,
          }
        }
      }
    }
    return result;
  }

  // param data: this.parseConditions
  reparseConditions(data: any) {
    const result = {};
    const o = Object.keys(data)[0] === 'all' ? "and" : "or";
    result['condition'] = o;
    result['rules'] = [];
    let tmp = (o === 'and') ? data.all : data.or;
    if (tmp && tmp.length) {
      // result['rules'] = [];
      for (let i = 0; i < tmp.length; ++i) {
        if (["all", "any"].includes(Object.keys(tmp[i])[0].toString())) {
          result['rules'][i] = this.reparseConditions(tmp[i]);
        }
        else {
          // field want
          result['rules'][i] = {
            field: '1',
            operator: '2'
          }
        }
      }
    }
    return result;
  }

  addData() {
    this.ruleService.addData(this.backendRule).subscribe((res) => {
      console.log(res);
    })
  }
}

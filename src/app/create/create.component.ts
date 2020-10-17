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
      { field: 'Event name', name: 'type', type: "text" },
      { field: 'Path', name: 'path', type: "text" },
      { field: 'Phí cố định', name: 'e_value_base', type: "number" },
      { field: 'Phí %', name: 'e_value_rate', type: "number" },
      { field: 'Giá trị lớn nhất', name: 'max_value', type: "number" },
      { field: 'Giá trị nhỏ nhất', name: 'min_value', type: "number" }
    ],
    [
      { field: 'Event name', name: 'type', type: "text" },
      { field: 'Connector name', name: 'connector_name', type: "text" },
      { field: 'Limit', name: 'limit', type: "number"}
    ],
    [],
    [
      { field: 'Event name', name: 'type', type: "text" },
      { field: 'Path', name: 'path', type: "text" },
      { field: 'Phí cố định', name: 'e_value_base', type: "number" },
      { field: 'Phí %', name: 'e_value_rate', type: "number" },
      { field: 'Giá trị lớn nhất', name: 'max_value', type: "number" },
      { field: 'Giá trị nhỏ nhất', name: 'min_value', type: "number" }
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
      from_date: null,
      to_date: null,
      priority: null,
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
      e_value_base: null,
      e_value_rate: null,
      min_value: null,
      max_value: null,
    }
  }

  initEventWithTypeRoute(): void {
    this.event = {
      type:'',
      connector_name: '',
      limit: null
    }
  }

  onChangeDateEj2(args, field) {
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
    if (this.r_type==='route') {
      this.initEventWithTypeRoute();
    }
  }

  selectFeeType(event: any) {
    this.feeTypeSelected = Number(event.target.value[3]);
    this.backendRule.fee_type = this.feeTypeSelected;
  }

  onChange(event: any) { // without type info
    let nam = event.target.name;
    let val = event.target.value;
    if (nam === 'status') {
      this.status = val === "ACTIVE" ? true : false;
    }
    this.backendRule[nam] = val;
  }

  checkNull(field: boolean, message: string) {
    if (field) {
      this.notifier.notify("error", message);
      return true;
    }
    return false;
  }

  getValue(): void {

    if (this.checkNull(this.backendRule.name === '', "The name of rule is require")) {
      return;
    };
    if (this.checkNull(this.backendRule.priority === null || Number(this.backendRule.priority) === 0, "The priority of rule is not correct")) {
      return;
    };
    let event = this.convertEvent(this.event);
    this.backendRule.event = event;
    this.backendRule.active = this.status;
    const conditions = this.parseConditions({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    // console.log(JSON.stringify(conditions));
    this.backendRule.conditions = JSON.stringify(conditions);
    this.addData();

  }

  convertEvent(data: any): any {
    let result ;
    if (data.type === '') return JSON.stringify({
      type: ""
    })
    
    if (this.r_type==='route') {
      result = {
        type: data.type,
        params: {
          connector_name: data.connector_name,
          limit: data.limit
        }
      }
    }
    else result = {
      type: data.type,
      params: {
        path: data.path,
        e_value_base: Number(data.e_value_base),
        e_value_rate: Number(data.e_value_rate),
        min_value: Number(data.min_value),
        max_value: Number(data.max_value)
      }
    };

    for(let item in result.params) {
      if (result.params[item] === null || result.params[item] === 0) {
        delete result.params[item];
      }
    }

    return JSON.stringify(result);
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

  addData() {
    if (!this.isAdd) return;
    this.ruleService.addData(this.backendRule).subscribe((res) => {
      // console.log(res);
      this.notifier.notify("success", 'Created Successfully');
    })
  }
}

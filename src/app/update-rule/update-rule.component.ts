import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { hardwareData } from './datasource';
import { RuleService } from '../rule.service';
import { BackendRule } from '../interfaces/backendRule';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from "angular-notifier";
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ActionType } from '../interfaces/actionType';

@Component({
  selector: 'app-update-rule',
  templateUrl: './update-rule.component.html',
  styleUrls: ['./update-rule.component.css']
})
export class UpdateRuleComponent implements OnInit {

  public data: Object[];
  public importRules: RuleModel;
  protected id: string;
  public currentRule: BackendRule;
  tData: boolean = false;
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

  public action = [];

  r_type: string;

  actionSelected: Array<any>;
  actionTypeSelected: string;
  feeTypeSelected: number;

  public isAdd = true;
  event = {
    type: '',
    path: '',
    e_value_base: null,
    e_value_rate: null,
    min_value: null,
    max_value: null,
  }

  constructor(
    private ruleService: RuleService,
    notifierService: NotifierService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.notifier = notifierService;
  }

  @ViewChild('querybuilder')
  public qryBldrObj: QueryBuilderComponent;

  ngOnInit(): void {
    this.data = hardwareData;
    this.id = this.route.snapshot.paramMap.get('id');
    this.actionType = [
      { id: 0, name: 'bonus' },
      { id: 1, name: 'route' },
      { id: 2, name: 'restrict' },
      { id: 3, name: 'fee' }
    ];

    this.actionSelected = this.listAction[0];


    this.getRule();
  }

  isChecked(check: boolean) {
    return check === this.currentRule.active;
  }

  convertDate(timestemp: number) {
    return moment(timestemp).format('YYYY-MM-DDThh:mm:ss');
  }

  getRule(): void {
    this.ruleService.getRule(this.id).subscribe((data: any) => {
      this.currentRule = data;
      this.tData = true;
      this.actionTypeSelected = this.currentRule.type;

      let action = this.actionType.find((x) => x.name === this.actionTypeSelected)
      this.actionSelected = this.listAction[Number(action.id)];

      let condition = this.currentRule.conditions;
      setTimeout(() => {
        this.importRules = this.reparseConditions(JSON.parse(condition));
        // this.qryBldrObj.setRules(this.importRules);
      }, 100)

      this.feeTypeSelected = this.currentRule.fee_type;

      if (this.currentRule.type === "fee") {
        this.isFee = true;
      }


      let x = JSON.parse(this.currentRule.event).type;
      if (x) {
        this.action['value'] = [];
        let tmp = JSON.parse(this.currentRule.event).params;
        this.action['value'] = tmp;
        this.action['value'].type = x;
      }

      this.swapFeeType();
    })
  }

  swapFeeType() {
    // set value 4 this.event after get data;
    if (this.action !==undefined ) {
      for (let item in this.action['value']) {
        this.event[item] = this.action['value'][item];
      }
    }
  }

  onChange4Event(event: any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.event[nam] = val;
  }

  setValue4Input(name: string) {
    if (this.action['value']) {
      return this.action['value'][name] !== undefined? this.action['value'][name] : null;
    }
    return null;
  }

  initFeeType() {
    this.currentRule.fee_type = 1;
  }

  selectChangeHandler(event: any) {
    this.swapFeeType();
    this.r_type = event.target.value.replace(/[^a-zA-Z]/g, '');
    this.currentRule.type = this.r_type;
    this.actionSelected = this.listAction[Number(event.target.value.replace(/[^0-9]/g, ''))];
    if (this.r_type === 'fee') {
      this.isFee = true;
    } else {
      this.isFee = false;
      this.initFeeType();
    }

    if (this.r_type === 'restrict') {
      this.event.type = "";
    }
    if (this.r_type === 'route'){
      delete this.event.min_value;
      delete this.event.max_value;
    }

  }

  selectFeeType(event: any) {
    this.feeTypeSelected = Number(event.target.value[3]);
    this.currentRule.fee_type = this.feeTypeSelected;
  }

  onChange(event: any) { // without type info
    let nam = event.target.name;
    let val = event.target.value;
    if (nam === 'status') {
      this.currentRule.active = val === "ACTIVE" ? true : false;
    } else
      this.currentRule[nam] = val;
  }

  goBack() {
    this.location.back();
  }

  updateRule(rule: BackendRule) {
    try {
      this.ruleService
        .updateData(this.id, rule).subscribe(
          res => {
            this.notifier.notify("success", "Successfully Updated!");
          }
        );
    } catch (e) {
      this.notifier.notify("error", "Whoops, something went wrong. Probably!");
    }
  }

  checkNull(field: any, message: string) {
    if (field) {
      this.notifier.notify("error", message);
      return true;
    }
    return false;
  }

  getValue(): void {

    let eventResult = this.convertEvent(this.event);
    console.log(eventResult);

    // console.log(this.event);
    // console.log(this.currentRule.fee_type);

    // const conditions = this.parseConditions({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });

    // this.currentRule.conditions = JSON.stringify(conditions);

    // console.log(this.currentRule);



  }

  convertEvent(data: any): any {
    if (data.type === '') return JSON.stringify({
      type: ""
    });
    let result = {
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

  onChangeDateEj2(args, field) {
    this.currentRule[field] = moment(args.value).valueOf();
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

  reparseConditions(data: any) {
    const result = {};
    const o = Object.keys(data)[0] === 'all' ? "and" : "or";
    result['condition'] = o;
    result['rules'] = [];
    let tmp = (o === 'and') ? data.all : data.or;
    if (tmp && tmp.length) {
      for (let i = 0; i < tmp.length; ++i) {
        if (["all", "any"].includes(Object.keys(tmp[i])[0].toString())) {
          result['rules'][i] = this.reparseConditions(tmp[i]);
        }
        else {
          result['rules'][i] = {
            field: tmp[i].fact,
            operator: tmp[i].operator,
            value: tmp[i].value
          }
        }
      }
    }
    return result;
  }
}

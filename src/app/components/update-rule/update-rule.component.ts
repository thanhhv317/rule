import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent, ColumnsModel, TemplateColumn } from '@syncfusion/ej2-angular-querybuilder';
import { hardwareData } from './datasource';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from "angular-notifier";
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ActionType } from '../../interfaces/actionType';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { getComponent, createElement } from '@syncfusion/ej2-base';
import { Helper } from '../../utils/helper';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BackendRule } from 'src/app/interfaces/backendRule';
import { RuleService } from 'src/app/services/rule.service';
import { AuthenticationService } from 'src/app/services';
import * as _ from 'lodash';
import { HistoryUpdate } from 'src/app/interfaces';
import { CookieService } from 'ngx-cookie-service';
import { HistoryService } from 'src/app/services';


@Component({
  selector: 'app-update-rule',
  templateUrl: './update-rule.component.html',
  styleUrls: ['./update-rule.component.css']
})
export class UpdateRuleComponent implements OnInit {

  helper = new Helper();
  public data: Object[];
  public importRules: RuleModel;
  protected id: string;
  public currentRule: BackendRule;
  tData: boolean = false;
  private readonly notifier: NotifierService;

  public actionType: ActionType[];
  public listAction = (new Helper).listAction;
  public isFee: Boolean = false;
  public fee_type = [
    { value: 1, field: 'Phí dịch vụ' },
    { value: 2, field: 'Phí thanh toán' },
    { value: 3, field: 'Phí offline' },
  ];

  public action = [];

  oldRule: any;

  r_type: string;

  actionSelected: Array<any>;
  actionTypeSelected: string;
  feeTypeSelected: number;

  public isAdd = true;
  public event: Object;
  public isFormat: Boolean = true;

  constructor(
    private ruleService: RuleService,
    notifierService: NotifierService,
    private route: ActivatedRoute,
    private location: Location,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _cookieService: CookieService,
    private _historyService: HistoryService

  ) {
    this.notifier = notifierService;
  }

  @ViewChild('querybuilder')
  public qryBldrObj: QueryBuilderComponent;
  public filter: ColumnsModel[];
  public inOperators: string[] = ['in', 'notin'];

  public transactionTypeTemplate: TemplateColumn;
  public serviceCodeTemplate: TemplateColumn;
  public suplierCodeTemplate: TemplateColumn;
  public paymentChanelTemplate: TemplateColumn;
  public connectorTemplate: TemplateColumn;

  //opeartor
  public operator: any;

  // value of condition
  public valueOfCondition = (new Helper).conditionName;

  ngOnInit(): void {

    this.authenticationService.handleUserRoute();

    this.data = hardwareData;
    this.id = this.route.snapshot.paramMap.get('id');
    this.transactionTypeTemplate = this.generateTemplate(this.valueOfCondition[0]);
    this.serviceCodeTemplate = this.generateTemplate(this.valueOfCondition[1]);
    this.suplierCodeTemplate = this.generateTemplate(this.valueOfCondition[2]);
    this.paymentChanelTemplate = this.generateTemplate(this.valueOfCondition[3]);
    this.connectorTemplate = this.generateTemplate(this.valueOfCondition[4]);

    // init operator;
    this.operator = (new Helper).operator;

    this.filter = [
      { field: 'TransactionType', label: 'Transaction type', operators: this.operator, type: 'string', template: this.transactionTypeTemplate },
      { field: 'ServiceCode', label: 'Service Code', operators: this.operator, type: 'string', template: this.serviceCodeTemplate },
      { field: 'SupplierCode', label: 'Supplier  Code', operators: this.operator, type: 'string', template: this.suplierCodeTemplate },
      { field: 'PaymentChanel', label: 'Payment Chanel', operators: this.operator, type: 'string', template: this.paymentChanelTemplate },
      { field: 'Connector', label: 'Connector', operators: this.operator, type: 'string', template: this.connectorTemplate }
    ];
    this.actionType = [
      { id: 0, name: 'bonus' },
      { id: 1, name: 'route' },
      { id: 2, name: 'restrict' },
      { id: 3, name: 'fee' }
    ];

    this.actionSelected = this.listAction[0];
    this.getRule();
  }

  generateTemplate(ds: string[]) {
    return {
      create: () => {
        return createElement('input', { attrs: { 'type': 'text' } });
      },
      destroy: (args: { elementId: string }) => {
        let multiSelect: MultiSelect = (getComponent(document.getElementById(args.elementId), 'multiselect') as MultiSelect);
        if (multiSelect) {
          multiSelect.destroy();
        }
        let dropdown: DropDownList = (getComponent(document.getElementById(args.elementId), 'dropdownlist') as DropDownList);
        if (dropdown) {
          dropdown.destroy();
        }
      },
      write: (args: { elements: Element, values: string[] | string, operator: string }) => {
        if (this.inOperators.indexOf(args.operator) > -1) {
          let multiSelectObj: MultiSelect = new MultiSelect({
            dataSource: ds,
            value: args.values as string[],
            mode: 'CheckBox',
            placeholder: 'Select Transaction',
            change: (e: any) => {
              this.qryBldrObj.notifyChange(e.value, e.element);
            }
          });
          multiSelectObj.appendTo('#' + args.elements.id);
        } else {
          let dropDownObj: DropDownList = new DropDownList({
            dataSource: ds,
            value: args.values as string,
            change: (e: any) => {
              this.qryBldrObj.notifyChange(e.itemData.value, e.element);
            }
          });
          dropDownObj.appendTo('#' + args.elements.id);
        }
      }
    }
  }

  initEvent() {
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
      type: '',
      connector_name: '',
      limit: null
    }
  }

  isChecked(check: boolean) {
    return check === this.currentRule.active;
  }

  convertDate(timestemp: number) {
    return moment(timestemp).format('YYYY-MM-DDTHH:mm:ss');
  }

  getRule(): void {
    let obj = {
      ruleID: this.id
    }
    this.ruleService.getRule(obj).subscribe(
      (data: any) => {
        this.oldRule = { ...data };
        this.currentRule = data;
        this.tData = true;
        this.actionTypeSelected = this.currentRule.type;
        let action = this.actionType.find((x) => x.name === this.actionTypeSelected)
        this.actionSelected = this.listAction[Number(action.id)];
        this.r_type = data.type;
        if (data.type === 'route') {
          this.initEventWithTypeRoute();
        }
        else {
          this.initEvent();
        }
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
      },
      err => {
        if (err.status === 500) {
          this.authenticationService.SwitchToPageNotFound();
        } else
          this.authenticationService.handleLoginSessionExpires();
      }
    )
  }

  swapFeeType() {
    // set value 4 this.event after get data;
    if (this.action !== undefined) {
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
      this.initEvent();
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
      if (!this.isAdd) return;
      this.ruleService
        .updateData(this.id, rule).subscribe(
          res => {
            this.notifier.notify("success", "Successfully Updated!");
            this.goHome();
          },
          err => {
            this.authenticationService.handleLoginSessionExpires();
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
    if (this.checkNull(this.currentRule.name === '', "The name of rule is require")) {
      return;
    };
    if (this.checkNull(this.currentRule.priority === null || Number(this.currentRule.priority) === 0, "The priority of rule is not correct")) {
      return;
    };
    if (this.checkNull(Number.isNaN(this.currentRule.from_date) || Number.isNaN(this.currentRule.to_date), "The from date and to date is require")) {
      return;
    };
    let eventResult = this.convertEvent(this.event);
    const conditions = this.parseConditions({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    this.currentRule.conditions = JSON.stringify(conditions);
    this.currentRule.event = (eventResult);
    this.historyUpdate();
    this.updateRule(this.currentRule);
  }

  historyUpdate() {

    if (_.isEqual(this.oldRule, this.currentRule)) {
      return;
    }
    let that = this;
    let data = [];

    let columnChange = _.reduce(this.oldRule, function (result, value, key) {
      return _.isEqual(value, that.currentRule[key]) ?
        result : result.concat(key);
    }, []);

    let ruleInfomation = [];
    let actionList = [];
    columnChange.map((item) => {
      if (item === "conditions") {
        if (_.isEqual(this.oldRule[item], this.currentRule[item])) {
          return;
        }
        let tmp: HistoryUpdate = {
          column: item,
          rule_id: this.id,
          update_persion: this._cookieService.get('username'),
          data: JSON.stringify([
            {
              old_value: this.oldRule[item],
              new_value: this.currentRule[item]
            }
          ])
        };
        data.push(tmp);
      }
      else if (item === "fee_type" || item === "type" || item === "event") {
        if (_.isEqual(this.oldRule[item], this.currentRule[item])) {
          return;
        }
        let tmp = {
          column: item,
          old_value: this.oldRule[item],
          new_value: this.currentRule[item]
        };
        actionList.push(tmp);
      } else {
        let tmp = {
          column: item,
          old_value: this.oldRule[item],
          new_value: this.currentRule[item]
        };
        ruleInfomation.push(tmp);
      }

    })

    if (!_.isEmpty(ruleInfomation)) {
      data.push({
        column: 'rule infomations',
        rule_id: this.id,
        update_persion: this._cookieService.get('username'),
        data: JSON.stringify(ruleInfomation)
      })
    }

    if (!_.isEmpty(actionList)) {
      data.push({
        column: 'actions',
        rule_id: this.id,
        update_persion: this._cookieService.get('username'),
        data: JSON.stringify(actionList)
      })
    }
    
    data.map((x) => {
      this._historyService.addData(x).subscribe(
        (data) => {
        },
        (err) => {
        }
      )
    })
  }

  convertEvent(data: any): any {
    let result: any;
    if (data.type === '') return JSON.stringify({
      type: ""
    })
    if (this.r_type === 'route') {
      result = {
        type: data.type,
        params: {
          connector_name: data.connector_name,
          limit: data.limit
        }
      }
    }
    else {
      data.e_value_base = data.e_value_base || ''
      data.min_value = data.min_value || ''
      data.max_value = data.max_value || ''
      result = {
        type: data.type,
        params: {
          path: data.path,
          e_value_base: Number(data.e_value_base.toString().replace(/\D/g, '')),
          e_value_rate: Number(data.e_value_rate),
          min_value: Number(data.min_value.toString().replace(/\D/g, '')),
          max_value: Number(data.max_value.toString().replace(/\D/g, ''))
        }
      };
    }
    for (let item in result.params) {
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
            value: this.helper.getValueFromKey(data.rules[i].value),
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
    let tmp = (o === 'and') ? data.all : data.any;
    if (tmp && tmp.length) {
      for (let i = 0; i < tmp.length; ++i) {
        if (["all", "any"].includes(Object.keys(tmp[i])[0].toString())) {
          result['rules'][i] = this.reparseConditions(tmp[i]);
        }
        else {
          result['rules'][i] = {
            field: tmp[i].fact,
            operator: tmp[i].operator,
            value: this.helper.getKeyFromValue(tmp[i].value)
          }
        }
      }
    }
    return result;
  }

  onBlur(key: string) {
    if (key === 'e_value_base' || key === 'max_value' || key === 'min_value') {
      this.event[key] = this.event[key] || "";
      this.event[key] = this.currencyPipe.transform(this.event[key].toString().replace(/\D/g, ''), 'VND', '')
    }
  }

  onFocus(key: string) {
    // if (key === 'e_value_base' || key === 'max_value' || key === 'min_value') {
    //   this.event[key] = this.event[key] ? this.event[key].toString().replace(/\D/g, '') : '';
    // }
  }

  formatInput(key: string) {
    // if (this.isFormat) {
    this.onBlur(key);
    //   this.isFormat= false;
    // }
    return this.event[key];
  }

  // go home
  goHome(): void {
    let path = '/';
    this.router.navigateByUrl(path);
  }

  onKey(event: any, key: string) {
    if (key === 'e_value_base' || key === 'max_value' || key === 'min_value') {
      this.event[key] = this.event[key] || "";
      this.event[key] = this.currencyPipe.transform(event.target.value.toString().replace(/\D/g, ''), 'VND', '')
    }
  }

}

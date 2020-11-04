import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent, ColumnsModel, TemplateColumn } from '@syncfusion/ej2-angular-querybuilder';
import { NotifierService } from "angular-notifier";
import { ActionType } from '../../interfaces/actionType';
import { BackendRule } from '../../interfaces/backendRule';
import * as moment from 'moment';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { getComponent, createElement } from '@syncfusion/ej2-base';
import { Helper } from '../../utils/helper';
import { CurrencyPipe } from '@angular/common';
import { Location } from '@angular/common';
import { RuleService } from 'src/app/services/rule.service';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  helper = new Helper();

  public data: Object[];
  public importRules: RuleModel;
  public isAdd = true;

  private readonly notifier: NotifierService;

  public actionType: ActionType[];
  public listAction = (new Helper).listAction;
  public isFee: Boolean = false;
  public fee_type = [
    { value: 1, field: 'Service Fees' },
    { value: 2, field: 'Payment Fees' },
    { value: 3, field: 'Offline Fees' },
  ];

  actionSelected: Array<any>;
  actionTypeSelected: string;
  feeTypeSelected: number;

  // data send: 
  r_type: string;
  public backendRule: BackendRule;
  status: boolean = true;

  event: Object;

  constructor(
    private ruleService: RuleService,
    notifierService: NotifierService,
    private currencyPipe: CurrencyPipe,
    private location: Location,
    private authenticationService: AuthenticationService
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

    //end template ej2
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

  initEventWithTypeRoute(): void {
    this.event = {
      type: '',
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
    if (this.r_type === 'route') {
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
    if (this.checkNull(Number.isNaN(this.backendRule.from_date) || this.backendRule.from_date === null || Number.isNaN(this.backendRule.to_date) || this.backendRule.to_date === null, "The from date and to date is require")) {
      return;
    };
    let event = this.convertEvent(this.event);
    this.backendRule.event = event;
    this.backendRule.active = this.status;
    const conditions = this.parseConditions({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    this.backendRule.conditions = JSON.stringify(conditions);
    this.addData();
  }

  convertEvent(data: any): any {
    let result;
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
      data.e_value_base = data.e_value_base || '';
      data.min_value = data.min_value || '';
      data.max_value = data.max_value || '';
      result = {
        type: data.type,
        params: {
          path: data.path,
          e_value_base: Number(data.e_value_base.replace(/\D/g, '')),
          e_value_rate: Number(data.e_value_rate),
          min_value: Number(data.min_value.replace(/\D/g, '')),
          max_value: Number(data.max_value.replace(/\D/g, ''))
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

  addData() {
    if (!this.isAdd) return;
    this.ruleService.addData(this.backendRule).subscribe(
      (res) => {
        this.notifier.notify("success", 'Created Successfully');
        this.backendRule.name = '';
        this.backendRule.priority = null;
      },
      err => {
        this.authenticationService.handleLoginSessionExpires();
      })
  }

  onBlur(key: string) {
    if (key === 'e_value_base' || key === 'max_value' || key === 'min_value') {
      this.event[key] = this.event[key] || "";
      this.event[key] = this.currencyPipe.transform(this.event[key].replace(/\D/g, ''), 'VND', '')
    }
  }

  goBack() {
    this.location.back();
  }

  onKey(event: any, key: string) {
    if (key === 'e_value_base' || key === 'max_value' || key === 'min_value') {
      this.event[key] = this.event[key] || "";
      this.event[key] = this.currencyPipe.transform(event.target.value.replace(/\D/g, ''), 'VND', '')
    }
  }
}

import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent, ColumnsModel, TemplateColumn } from '@syncfusion/ej2-angular-querybuilder';
import { RuleService } from '../rule.service';
import { BackendRule } from '../interfaces/backendRule';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { getComponent, createElement } from '@syncfusion/ej2-base';
import { Helper } from '../utils/helper';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-view-rule',
  templateUrl: './view-rule.component.html',
  styleUrls: ['./view-rule.component.css']
})

export class ViewRuleComponent implements OnInit {

  helper = new Helper();

  public data: Object[];
  public importRules: RuleModel;
  public id: string;
  public currentRule: BackendRule;
  tData: boolean = false;
  public action = [
    'type', 'key', 'value'
  ];


  public translateAtion: any;

  public showButtons: Object = { groupInsert: false, groupDelete: false, ruleDelete: false }

  constructor(
    private ruleService: RuleService,
    private route: ActivatedRoute,
    private location: Location,
    private currencyPipe:CurrencyPipe
  ) { }

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
  public valueOfCondition = [
    ['Nạp tiền điện thoại', 'Trả sau', 'Thanh toán hóa đơn', 'Mua mã thẻ', 'Nạp tiền từ ngân hàng', 'Rút tiền về ngân hàng', 'Chuyển tiền về từ ngân hàng'],
    ['Topup', 'HĐ Điện', 'HĐ Nước', 'Mua mã thẻ(dt, game, data)'],
    ['Viettel', 'Vinaphone', 'Mobifone'],
    ['Ví ECO', 'COD', 'NH liên kết', 'NH hỗ trợ', 'eFund'],
    ['NH liên kết BIDV', 'NH liên kết Sacombank', 'NH hỗ trợ Napas', 'Chuyển tiền IBFP']
  ]


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.transactionTypeTemplate = this.generateTemplate(this.valueOfCondition[0]);
    this.serviceCodeTemplate = this.generateTemplate(this.valueOfCondition[1]);
    this.suplierCodeTemplate = this.generateTemplate(this.valueOfCondition[2]);
    this.paymentChanelTemplate = this.generateTemplate(this.valueOfCondition[3]);
    this.connectorTemplate = this.generateTemplate(this.valueOfCondition[4]);

    // init operator;
    this.operator = [
      { value: 'equal', key: 'Equal' },
      { value: 'notequal', key: 'Not Equal' },
      { value: 'in', key: 'In' },
      { value: 'notin', key: 'Not In' }
    ];

    this.filter = [
      { field: 'TransactionType', label: 'Transaction type', operators: this.operator, type: 'string', template: this.transactionTypeTemplate },
      { field: 'ServiceCode', label: 'Service Code', operators: this.operator, type: 'string', template: this.serviceCodeTemplate },
      { field: 'SupplierCode', label: 'Supplier  Code', operators: this.operator, type: 'string', template: this.suplierCodeTemplate },
      { field: 'PaymentChanel', label: 'Payment Chanel', operators: this.operator, type: 'string', template: this.paymentChanelTemplate },
      { field: 'Connector', label: 'Connector', operators: this.operator, type: 'string', template: this.connectorTemplate }
    ];

    this.getRule();

    this.translateAtion = [
      { key: 'path', value: 'Path' },
      { key: 'e_value_base', value: 'Fixed value' },
      { key: 'e_value_rate', value: 'Percent value' },
      { key: 'min_value', value: 'Min value' },
      { key: 'max_value', value: 'Max value' },
      { key: 'connector_name', value: 'Connector name' },
      { key: 'limit', value: 'Limit' }
    ];
  }

  getRule(): void {
    this.ruleService.getRule(this.id).subscribe((data: any) => {
      this.currentRule = data;
      this.tData = true;
      this.action['type'] = JSON.parse(this.currentRule.event).type;

      this.action['key'] = [];
      this.action['value'] = [];
      let tmp = JSON.parse(this.currentRule.event).params;
      this.action['value'] = tmp;

      let i = 0;
      for (let item in tmp) {
        this.action['key'][i] = item;
        i++;
      }

      let condition = (this.reparseConditions(JSON.parse(this.currentRule.conditions)));

      setTimeout(() => {
        this.importRules = (condition);
        this.qryBldrObj.setRules(this.importRules);

      }, 100)
    })

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

  getStatusFromActive(status: boolean) {
    return status ? "Active" : "Inactive";
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

  formatDateTime(timestemp: number) {
    return moment(timestemp).format("DD/MM/YYYY - HH:mm:ss");
  }

  formatFeeType(feetype: number): string {
    let result = {
      1: 'Service Fees',
      2: 'Pay Fees',
      3: 'Offline Fees'
    };
    return result[feetype];
  }

  goBack() {
    this.location.back();
  }

  translateActionName(str: string): string {
    let kq = this.translateAtion.find((o, i) => {
      return o.key === str;
    })
    return kq.value;
  }

  formatPrice(price: any) {
    if (Number(price) > 999) return (this.currencyPipe.transform(price, 'VND', '' ));
    return price;
  }

}

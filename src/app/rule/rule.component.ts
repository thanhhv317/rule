import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { RuleService } from '../rule.service';
import { Rule } from '../interfaces/rule';
import { NotifierService } from "angular-notifier";
import { ActionType } from '../interfaces/actionType';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['rule.component.css']
})

export class RuleComponent implements OnInit {
  public data: Object[];
  public importRules: RuleModel;
  public isAdd = true;

  public info: Rule = {
    name: '',
    description: '',
    status: 'ACTIVE',
    conditions: '',
    actions: '',
    from: '',
    to: '',
    data: '',
  };

  // event
  action = {
    discount_amout: 0,
  }

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
  ]

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
    ]
  }

  onChange(event: any) { // without type info
    let nam = event.target.name;
    let val = event.target.value;
    this.info[nam] = val;
  }

  onChangeEvent(event: any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.action[nam] = val;
    this.info.actions = JSON.stringify({
      type: "actions of rule",
      params: {
        discount: this.action.discount_amout,
      }
    })
  }

  addRule(rule: Rule) {
    this.ruleService
      .addData(rule).subscribe(
        res => {
          this.notifier.notify("success", "Created successfully!");
          this.info.name = '';
          this.info.description = '';
          this.info.from = '';
          this.info.to = '';
          this.action.discount_amout = 0;
        }
      );
  }

  checkNull(field: any, message: string) {
    if (field) {
      this.notifier.notify("error", message);
      return true;
    }
    return false;
  }

  getValue(): void {
    // if (this.checkNull(this.info.name === '', "The name of rule is require")) {
    //   return;
    // };
    // if (this.checkNull(this.info.description === '', "The description of rule is require")) {
    //   return;
    // };
    // if (this.checkNull(this.info.from === '' || this.info.to === '', "The field FROM and TO is require!")) {
    //   return;
    // };
    // if (this.checkNull(this.action.discount_amout === 0 || this.action.discount_amout > 100, "The discount must be >0 && <100")) {
    //   return;
    // };
    // const parse = (data) => {
    //   const result = {};
    //   const o = data.condition === "or" ? "any" : "all";
    //   result[o] = [];
    //   if (data.rules && data.rules.length) {
    //     result[o] = [];
    //     for (let i = 0; i < data.rules.length; i++) {
    //       if (data.rules[i].condition) {
    //         result[o][i] = parse(data.rules[i]);
    //       } else {
    //         // check
    //         if (data.rules[i].value === undefined || data.rules[i].value === '') {
    //           this.notifier.notify("error", 'The conditions is not correct');
    //           this.isAdd = false;
    //           return;
    //         }
    //         this.isAdd = true;
    //         result[o][i] = {
    //           fact: data.rules[i].field,
    //           operator: data.rules[i].operator,
    //           value: data.rules[i].value,
    //         }
    //       }
    //     }
    //   }
    //   return result;
    // }
    // const result = parse({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    // this.info.conditions = JSON.stringify(result)
    // this.info.data = JSON.stringify({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    // if (this.isAdd) {
    //   this.addRule(this.info);
    // }
  }
}
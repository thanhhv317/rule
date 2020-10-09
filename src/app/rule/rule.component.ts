

import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { hardwareData } from './datasource';
import { RuleService } from '../rule.service';
import { Rule } from '../interfaces/rule';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html'
})

export class RuleComponent implements OnInit {
  public data: Object[];
  public importRules: RuleModel;

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
    apply: '',
    discount_amout: '',
    discard_subsequent: 'YES',
  }

  constructor(private ruleService: RuleService) { }

  @ViewChild('querybuilder')
  public qryBldrObj: QueryBuilderComponent;
  @ViewChild('dialog')
  public Dialog: DialogComponent;
  public animationSettings: Object = { effect: 'Zoom', duration: 400 };
  public showCloseIcon: Boolean = true;
  public hidden: Boolean = false;
  public width: string = '0%';
  public height: string = '80%';
  public promptHeader: string = 'Querybuilder Rule';
  ngOnInit(): void {
    this.data = hardwareData;

    this.importRules = {
      'condition': 'or',
      'rules': [{
        'label': 'Category',
        'field': 'Category',
        'type': 'string',
        'operator': 'equal',
        'value': 'Laptop'
      },
      {
        'condition': 'and',
        'rules': [{
          'label': 'Status',
          'field': 'Status',
          'type': 'string',
          'operator': 'notequal',
          'value': 'Pending'
        },
        {
          'label': 'Task ID',
          'field': 'TaskID',
          'type': 'number',
          'operator': 'equal',
          'value': 5675
        }]
      }]
    };

    // this.qryBldrObj.setRules(this.importRules);

  }

  // getListRule(): void {
  //   this.ruleService.sendGetRequest().subscribe((data: any[]) => {
  //     console.log(data);
  //   })
  // }

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
      type: this.action.apply,
      params: {
        discount: this.action.discount_amout,
        status: this.action.discard_subsequent,
      }
    })
  }


  addRule(rule: Rule) {
    this.ruleService
      .addData(rule).subscribe(
        res => {
          console.log(res);
        }
      );
  }

  getValue(): void {
    const parse = (data) => {
      const result = {};
      const o = data.condition === "or" ? "any" : "all";
      result[o] = [];
      if (data.rules && data.rules.length) {
        result[o] = [];
        for (let i = 0; i < data.rules.length; i++) {
          if (data.rules[i].condition) {
            result[o][i] = parse(data.rules[i]);
          } else {
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
    const result = parse({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    this.info.conditions = JSON.stringify(result)
    this.info.data = JSON.stringify({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });

    this.addRule(this.info)
  }
}
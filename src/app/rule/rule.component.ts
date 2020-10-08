

import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { hardwareData } from './datasource';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
})

export class RuleComponent implements OnInit {
  public data: Object[];
  public importRules: RuleModel;
  @ViewChild('querybuilder')
  public qryBldrObj: QueryBuilderComponent;
  @ViewChild('dialog')
  public Dialog: DialogComponent;
  public animationSettings: Object = { effect: 'Zoom', duration: 400 };
  public showCloseIcon: Boolean = true;
  public hidden: Boolean = false;
  public width: string = '70%';
  public height: string = '80%';
  public promptHeader: string = 'Querybuilder Rule';
  ngOnInit(): void {
    this.data = hardwareData;
    // this.importRules = {
    //   'condition': 'or',
    //   'rules': [{
    //     'label': 'Category',
    //     'field': 'Category',
    //     'type': 'string',
    //     'operator': 'equal',
    //     'value': 'Laptop'
    //   }]
    // };
  }
  getJson(): void {
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
    console.log(JSON.stringify(result))
    this.Dialog.content = '<pre>' + JSON.stringify({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules }, null, 4) + '</pre>';
    this.Dialog.show();
  }
}
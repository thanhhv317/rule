import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { hardwareData } from './datasource';
import { RuleService } from '../rule.service';
import { Rule } from '../interfaces/rule';
import { NotifierService } from "angular-notifier";

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
    discount_amout: 0,
  }

  private readonly notifier: NotifierService;

  constructor(private ruleService: RuleService, notifierService: NotifierService) { 
    this.notifier = notifierService; 
  }

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
    // this.data = hardwareData;
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
    if(this.checkNull(this.info.name === '', "The Name of rule is require")) {
      return;
    };
    if(this.checkNull(this.info.description === '', "The description of rule is require")) {
      return;
    };
    if(this.checkNull(this.info.from ==='' || this.info.to==='', "The field FROM and TO is require!") ) {
      return;
    };
    if(this.checkNull(this.action.discount_amout === 0, "The discount must be > 0")) {
      return;
    };
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
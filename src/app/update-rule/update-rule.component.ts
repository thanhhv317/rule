
import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { hardwareData } from './datasource';
import { RuleService } from '../rule.service';
import { Rule } from '../interfaces/rule';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from "angular-notifier";

import * as moment from 'moment';

@Component({
  selector: 'app-update-rule',
  templateUrl: './update-rule.component.html',
  styleUrls: ['./update-rule.component.css']
})
export class UpdateRuleComponent implements OnInit {
  public data: Object[];
  public importRules: RuleModel;
  protected id: string;

  public currentRule: Rule;
  tData: boolean = false;
  public discount = 0;

  private readonly notifier: NotifierService;
  // event
  action = {
    discount_amout: '',
  }

  constructor(
    private ruleService: RuleService,
    notifierService: NotifierService,
    private route: ActivatedRoute
  ){
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
    this.data = hardwareData;
    this.id = this.route.snapshot.paramMap.get('id');
    this.getRule();
  }

  getRule(): void {
    this.ruleService.getRule(this.id).subscribe((data: any) => {
      this.currentRule = data;
      this.tData = true;
      this.currentRule.from = moment(this.currentRule.from).format("YYYY-MM-DDTHH:MM:SS");
      this.currentRule.to = moment(this.currentRule.to).format("YYYY-MM-DDTHH:MM:SS");
      let tmp = JSON.parse(this.currentRule.actions);
      this.discount = tmp.params.discount
      setTimeout(() => {
        this.importRules = JSON.parse(this.currentRule.data);
        this.qryBldrObj.setRules(this.importRules);
      }, 100)
    })
  }

  onChange(event: any) { // without type info
    let nam = event.target.name;
    let val = event.target.value;
    this.currentRule[nam] = val;
  }

  onChangeEvent(event: any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.discount = val;
    this.action[nam] = val;
    this.currentRule.actions = JSON.stringify({
      type: "actions of rule",
      params: {
        discount: this.action.discount_amout,
      }
    })
  }

  updateRule(rule: Rule) {
    try {
      this.ruleService
      .updateData(this.id, rule).subscribe(
        res => {
          this.notifier.notify("success", "Successfully Updated!");
          }
        );
    } catch(e) {
      this.notifier.notify("error", "Whoops, something went wrong. Probably!");
    }
   
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
    this.currentRule.conditions = JSON.stringify(result)
    this.currentRule.data = JSON.stringify({ condition: this.qryBldrObj.rule.condition, rules: this.qryBldrObj.rule.rules });
    this.updateRule(this.currentRule)
    // console.log(this.currentRule)
  }

}

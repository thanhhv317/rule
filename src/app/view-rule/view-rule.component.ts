import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { RuleService } from '../rule.service';
import { BackendRule } from '../interfaces/backendRule';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-view-rule',
  templateUrl: './view-rule.component.html',
  styleUrls: ['./view-rule.component.css']
})

export class ViewRuleComponent implements OnInit {

  public data: Object[];
  public importRules: RuleModel;
  public id: string;
  public currentRule: BackendRule;
  tData: boolean = false;
  public action = [];

  public showButtons: Object = { groupInsert: false, groupDelete: false, ruleDelete: false }

  constructor(
    private ruleService: RuleService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  @ViewChild('querybuilder')
  public qryBldrObj: QueryBuilderComponent;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getRule();
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

        let gInput = document.querySelectorAll(".e-input");
        Array.from(gInput).map((node) => {
          node.setAttribute('readonly', 'true');
        })

        let conditionAnd = document.querySelectorAll(".e-btngroup-and");
        Array.from(conditionAnd).map((node) => {
          node.setAttribute('disabled', 'true');
        })

        let conditionOr = document.querySelectorAll(".e-btngroup-or");
        Array.from(conditionOr).map((node) => {
          node.setAttribute('disabled', 'true');
        })

      }, 100)
    })
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
            value: tmp[i].value
          }
        }
      }
    }
    return result;
  }

  formatDateTime(timestemp: number) {
    return moment(timestemp).format("DD/MM/YYYY - hh:mm A");
  }

  formatFeeType(feetype: number): string {
    let result = {
      1: 'Phí dịch vụ',
      2: 'Phí thanh toán',
      3: 'Phí Offline'
    };
    return result[feetype];
  }

  goBack() {
    this.location.back();
  }
}

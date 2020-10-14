import { Component, ViewChild, OnInit } from '@angular/core';
import { RuleModel, QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { RuleService } from '../rule.service';
import { Rule } from '../interfaces/rule';
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
  protected id: string;
  public currentRule: Rule;
  tData: boolean = false;
  public discount = 0;

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
      this.currentRule.from = moment(this.currentRule.from).format("DD/MM/YYYY -- hh:mm:ss");
      this.currentRule.to = moment(this.currentRule.to).format("DD/MM/YYYY -- hh:mm:ss");
      let tmp = JSON.parse(this.currentRule.actions);
      this.discount = tmp.params.discount
      setTimeout(() => {
        this.importRules = JSON.parse(this.currentRule.data);
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

        // Array.from(gInput).map((oldElement) => {
        //   let newElement = oldElement.cloneNode(true);
        //   oldElement.parentElement.replaceChild(newElement, oldElement);
        // })

      }, 100)
    })
  }

  goBack() {
    this.location.back();
  }
}

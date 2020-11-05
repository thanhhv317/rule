import { Component, OnInit } from '@angular/core';
import { HistoryService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Helper } from 'src/app/utils/helper';
import { CurrencyPipe } from '@angular/common';

export interface ActionChange {
  column: String;
  old: String;
  new: String;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  protected id: String;
  historyData = [];
  helper = new Helper();
  public fee_type = [
    'none',
    'Service Fees',
    'Payment Fees',
    'Offline Fees',
  ];

  constructor(
    private _historyService: HistoryService,
    private _route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
  ) { }

  ngOnInit(): void {

    this.id = this._route.snapshot.paramMap.get('id');
    this.getData();

  }

  getData(): void {
    this._historyService.getHistory(this.id).subscribe(
      (data) => {
        if (data['histories'] && data['histories'].length) {
          let d = data['histories'];
          for (let i = 0; i < d.length; ++i) {
            let tmp = {
              num: i + 1,
              column: d[i].column,
              update_persion: d[i].update_persion,
              time_update: moment(d[i].createdAt).format('DD/MM/YYYY HH:mm:ss'),
              data: JSON.parse(d[i].data)
            }
            this.historyData.push(tmp)
          }
        }
      },
      err => {
      }
    )
  }

  getHref(num: any) {
    return "#collapseOne" + num;
  }

  formatDateTime(path: String, data: any) {
    if (path === 'from_date' || path === 'to_date') {
      return moment(data).format('DD/MM/YYYY HH:mm:ss');
    }
    else return data;
  }

  hanleActionColumn(data: any) {
    // Locking
    let html = ``;
    if (data.column === 'fee_type') {
      let ftp = (this.getFeeType(data.old_value));
      let ftp2 = (this.getFeeType(data.new_value));
      html += `<li>Fee type: ${ftp} <span class="from-to"> >> </span> ${ftp2}</li>`;
    }
    if (data.column === 'type') {
      html += `<li>Type: ${data.old_value} <span class="from-to"> >> </span> ${data.new_value}</li>`;
    }
    if (data.column === 'event') {
      let d = JSON.parse(data.old_value);
      let d2 = JSON.parse(data.new_value);
      let result = [];
      if (d.type !== d2.type) {
        let tmp: ActionChange = {
          column: 'Action name',
          old: d.type || '""',
          new: d2.type || '""'
        };
        html += `<li>${tmp.column}: ${tmp.old} <span class="from-to"> >> </span> ${tmp.new}</li>`;
      }

      if (!_.isEqual(d.params, d2.params)) {
        if (d.params === undefined || d2.params === undefined) {
          let tmp: ActionChange = {
            column: 'Action params',
            old: JSON.stringify(d.params, undefined, 3) || '""',
            new: JSON.stringify(d2.params, undefined, 3) || '""'
          };
          result.push(tmp);
        } else {
          let o = [];
          let n = [];
          for (let [key, value] of Object.entries(d.params)) {
            o.push({ key, value });
          }
          for (let [key, value] of Object.entries(d2.params)) {
            n.push({ key, value });
          }
          let o2 = [...o];
          let n2 = [...n];

          for (let i = 0; i < o.length; ++i) {
            for (let j = 0; j < n.length; ++j) {
              if (_.isEqual(o[i], n[i])) {
                let index = o2.indexOf(o[i]);
                if (index > -1) {
                  o2.splice(index, 1);
                }

                let index2 = n2.indexOf(n[i]);
                if (index > -1) {
                  n2.splice(index2, 1);
                }

              }
            }
          }
          let old_param = {};
          let new_param = {};
          o2.map((value) => {
            old_param[value['key']] = value['value']
          })

          n2.map((value) => {
            new_param[value['key']] = value['value']
          })

          result.push({
            column: 'Action params',
            old: JSON.stringify(old_param, undefined, 3) || '""',
            new: JSON.stringify(new_param, undefined, 3) || '""'
          })
        }

      }

      result.map((x) => {
        html += `<li>${x.column}: <pre>${x.old}</pre> <span class="from-to"> >> </span> <pre>${x.new}</pre></li>`;
      })
    }

    return html;
  }

  hanleActionColumnV2(data: any) {
    let html = ``;
    if (data.column === 'fee_type') {
      let ftp = (this.getFeeType(data.old_value));
      let ftp2 = (this.getFeeType(data.new_value));
      html += `<li>Fee type: ${ftp} <span class="from-to"> >> </span> ${ftp2}</li>`;
    }
    if (data.column === 'type') {
      html += `<li>Type: ${data.old_value} <span class="from-to"> >> </span> ${data.new_value}</li>`;
    }
    if (data.column === 'event') {
      let d = JSON.parse(data.old_value);
      let d2 = JSON.parse(data.new_value);
      let result = [];
      if (d.type !== d2.type) {
        let tmp: ActionChange = {
          column: 'Action name',
          old: d.type || '""',
          new: d2.type || '""'
        };
        html += `<li>${tmp.column}: ${tmp.old} <span class="from-to"> >> </span> ${tmp.new}</li>`;
      }

      if (!_.isEqual(d.params, d2.params)) {
        if (d.params === undefined || d2.params === undefined) {
          let tmp: ActionChange = {
            column: 'Action params',
            old: d.params || '""',
            new: d2.params || '""'
          };
          result.push(tmp);
        } else {
          let o = [];
          let n = [];
          for (let [key, value] of Object.entries(d.params)) {
            o.push({ key, value });
          }
          for (let [key, value] of Object.entries(d2.params)) {
            n.push({ key, value });
          }
          let o2 = [...o];
          let n2 = [...n];

          for (let i = 0; i < o.length; ++i) {
            for (let j = 0; j < n.length; ++j) {
              if (_.isEqual(o[i], n[i])) {
                let index = o2.indexOf(o[i]);
                if (index > -1) {
                  o2.splice(index, 1);
                }
                let index2 = n2.indexOf(n[i]);
                if (index > -1) {
                  n2.splice(index2, 1);
                }
              }
            }
          }
          let old_param = {};
          let new_param = {};
          o2.map((value) => {
            old_param[value['key']] = value['value']
          })
          n2.map((value) => {
            new_param[value['key']] = value['value']
          })
          result.push({
            column: 'Action params',
            old: old_param || '',
            new: new_param || ''
          })

        }
      }

      result.map((x) => {
        if (Object.keys(x['new']).join('').length > Object.keys(x['old']).join('').length) {
          for (const [key] of Object.entries(x['new'])) {
            if (x['old'][key] != x['new'][key]) {
              html += `<li>${key}: ${this.formatNumber(x['old'][key]) || '" "'} <span class="from-to"> >> </span> ${this.formatNumber(x['new'][key]) || '" "'}</li>`;
            }
          }
        } else
          for (const [key] of Object.entries(x['old'])) {
            if (x['old'][key] != x['new'][key]) {
              html += `<li>${key}: ${this.formatNumber(x['old'][key]) || '" "'} <span class="from-to"> >> </span> ${this.formatNumber(x['new'][key]) || '" "'}</li>`;
            }
          }
      })
    }

    return html;
  }

  getFeeType(fee: any) {
    return this.fee_type[fee];
  }

  formatNumber(num: any) {
    let tmp = Number(num);
    if (tmp > 999) {
      return this.currencyPipe.transform(tmp.toString().replace(/\D/g, ''), 'VND', '')
    }
    return num;
  }


  handleConditionColumn(data: any, data2: any) {
    let d = JSON.parse(data);
    let d2 = JSON.parse(data2);
    let html = `<li>conditions: <pre>${JSON.stringify(this.reparseConditions(d), undefined, 3)}</pre> <span class="from-to"> >> </span> <pre>${JSON.stringify(this.reparseConditions(d2), undefined, 3)}</pre></li>`;
    return html;
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

}

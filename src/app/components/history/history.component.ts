import { Component, OnInit } from '@angular/core';
import { HistoryService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  protected id: String;
  historyData = [];

  constructor(private _historyService: HistoryService,

    private _route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.id = this._route.snapshot.paramMap.get('id');
    this.getData();

  }

  getData(): void {
    this._historyService.getHistory(this.id).subscribe(
      (data) => {
        if (data['histories'] && data['histories'].length) {
          let d = data['histories'];
          for(let i =0;i<d.length;++i) {
            let tmp = {
              num: i+1,
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
        console.log(err)
      }
    )
  }

  hanleEventColumn(data: any, data2: any) {
    let e = JSON.parse(data);
    let e2 = JSON.parse(data2);

    console.log()
  }

}

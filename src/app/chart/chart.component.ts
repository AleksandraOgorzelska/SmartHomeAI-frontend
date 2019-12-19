import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceHistoryResponse } from '../interfaces/device-history-response';
import { Chart } from 'chart.js';
import { DeviceService } from '../services/device.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  private chart: Chart;
  private owner: string;
  private device: string;
  private capability: string;
  private dates: string[];
  private values: number[];

  constructor(private deviceSerice: DeviceService,
              private accountService: AccountService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    let response: DeviceHistoryResponse[];
    this.owner = this.route.snapshot.params['owner'];
    this.device = this.route.snapshot.params['device'];
    this.capability = this.route.snapshot.params['capability'];
    this.deviceSerice.get_historical_data(this.owner, this.device, this.capability).then(r => {
      response = r;
      this.dates = response.map(data => data.date.toString());
      this.values = response.map(data => data.value);

      this.chart = new Chart('chart-canvas', {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              data: this.values,
              borderColor: '#D8C9FD',
              fill: false,
              lineTension: 0.2
            },
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true,
              type: 'time',
              time: {
                parser: 'YYYY-MM-DD HH:mm:ss',
                tooltipFormat: 'll HH:mm:ss',
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Value'
              },
            }],
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
  }
}

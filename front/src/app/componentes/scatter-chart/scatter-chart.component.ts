import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'grafico-dispersion',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.css']
})
export class ScatterChartComponent implements OnInit {

  // scatter
  public scatterChartOptions: ChartOptions = {
    responsive: true,
  };
  public scatterChartData: ChartDataSets[] = [
    {
      data: [
        { x: 1, y: 1 },
        { x: 50, y: 50 },
        { x: 100, y: 100 },
        { x: 1, y: 100 },
        { x: 100, y: 1 },
      ],
      label: 'Series A',
      pointRadius: 10,
    },
    {
      data: [
        { x: 10, y: 10 },
        { x: 45, y: 45 },
        { x: 90, y: 90 },
        { x: 10, y: 100 },
        { x: 100, y: 25 },
      ],
      label: 'Series B',
      pointRadius: 10,
    },
  ];
  public scatterChartType: ChartType = 'scatter';

  constructor() { }

  ngOnInit(): void {
  }

}

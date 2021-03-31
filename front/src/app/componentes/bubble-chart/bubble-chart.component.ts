import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
@Component({
  selector: 'grafico-burbuja',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
  };

  public bubbleChartData: ChartDataSets[] = [
    {
      data: [
        { x: 1, y: 1, r: 10 },
        { x: 50, y: 50, r: 90 },
        { x: 100, y: 100, r: 60 },
        { x: 1, y: 100, r: 20 },
        { x: 100, y: 1, r: 30 },
      ],
      label: 'Series A',
    },
  ];

  public bubbleChartType: ChartType = 'bubble';
  constructor() { }

  ngOnInit(): void {
  }

}

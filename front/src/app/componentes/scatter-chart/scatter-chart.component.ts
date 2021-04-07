import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'grafico-dispersion',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.css']
})
export class ScatterChartComponent implements OnInit {

  @Input() ugl: string; 
  @Input() eval_global: string; 
  @Input() eval_asistencial: string; 
  @Input() eval_facturacion: string; 
  @Input() data: string; 


  
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
    console.log(this.ugl)
    console.log(this.eval_global)
    console.log(this.eval_asistencial)
    console.log(this.eval_facturacion)
  }
  
  ngOnChanges(){
    console.log(this.data)

  }

}

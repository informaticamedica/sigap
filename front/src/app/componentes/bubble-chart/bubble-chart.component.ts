import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
@Component({
  selector: 'grafico-burbuja',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {

  
  @Input() ugl: string; 
  @Input() eval_global: string; 
  @Input() eval_asistencial: string; 
  @Input() eval_facturacion: string; 
  @Input() data: string[]; 
  
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

  datos
  sumaFacturacion
  ngOnChanges(){
    console.log("this.ugl",this.ugl)
    
    this.datos = this.data?.filter(a=>a['UGL']==this.ugl)
    this.sumaFacturacion = this.datos?.reduce((acc,curr)=>{return acc +curr["Decilo Facturación"]},0)
    let lala = this.datos?.map(a => {return {x:a["Decilo Facturación"],y:a['Decilo Asistencial']}})
    console.log(this.datos,this.sumaFacturacion,lala)

  }

}

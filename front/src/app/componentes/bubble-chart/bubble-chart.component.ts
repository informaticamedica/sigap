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
  @Input() data: ChartDataSets[];
  @Input() backgroundColor: [];

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: false },
    tooltips:{
      callbacks:{
        label: (t,d) => {
          
           let rLabel = d.datasets[t.datasetIndex].data[t.index]["r"]

          return d.datasets[t.datasetIndex].label + ": (Asistencial: "+t.xLabel+", Administrativo: " + t.yLabel +", Cantidad prestadores: " +rLabel +" )" } 
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          max: 10
        }, scaleLabel: {
          labelString: "Decilo Asistencial",
          display: true
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 10
        }, scaleLabel: {
          labelString: "Decilo Administrativo",
          display: true
        }
      }]
    }
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
  ngOnChanges() {

    if (this.data != undefined) {

      this.bubbleChartData = this.data
    }
    // console.log("this.bubbleChartData",this.bubbleChartData,this.data)


    // this.datos = this.data?.filter(a=>a['UGL']==this.ugl)
    // this.sumaFacturacion = this.datos?.reduce((acc,curr)=>{return acc +curr["Decilo Facturación"]},0)
    // let lala = this.datos?.map(a => {return {x:a["Decilo Facturación"],y:a['Decilo Asistencial']}})
    // console.log(this.datos,this.sumaFacturacion,lala)



  }

}

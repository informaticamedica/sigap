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
  @Input() data: string[];



  // scatter
  public scatterChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          min : 0,
          max : 10
        }
      }],
      yAxes: [{
        ticks: {
          min : 0,
          max : 10
        }
      }]
    }

    
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
      pointRadius: 50,
    },
  ];
  public scatterChartType: ChartType = 'scatter';
  sumaFacturacion;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.eval_global)
    // console.log(this.eval_asistencial)
    // console.log(this.eval_facturacion)
    let lala = this.datos?.map(a => { return { x: a["Decilo Facturación"], y: a['Decilo Asistencial'] } })
    if (lala != undefined) {

      // this.scatterChartData = [{
      //   data: lala?.slice(),
      //   label: 'Prestadores',
      //   pointRadius: 10,
        

      // }]


    }
  }
  datos
  ngOnChanges() {
    // console.log("xxxxxxx this.dataxxxxxxxxx",  this.data)
    // console.log("this.ugl", this.ugl,this.ugl == '')

    if (this.ugl == "Todas" || this.ugl == '') {
      this.datos = this.data
    } else 
    this.datos = this.data?.filter(a => a['UGL'] == this.ugl)
    
    this.sumaFacturacion = this.datos?.reduce((acc, curr) => { return acc + curr["Decilo Facturación"] }, 0)
    let lala = this.datos?.map(a => { return { x: a["Decilo Facturación"], y: a['Decilo Asistencial'] } })
    // console.log("alalalala",lala);
    
    if (lala != undefined) {

      // this.scatterChartData = [{
      //   data: lala?.slice(),
      //   label:  this.ugl,
      //   pointRadius: 10,

      // }]


    }
    // this.scatterChartData.
    // this.scatterChartData[0]['data']=lala?.slice()
    // console.log("aaaaaaaaaaaaaa", lala, this.scatterChartData, this.scatterChartData[0]['data'])

  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
@Component({
  selector: 'grafico-barra',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @Input() type: String = 'bar'
  @Input() label: string[]
  @Input() data: []
  @Input() ugl: string
  @Input() filtro: string
  @Input() barChartData1: []

  public barChartOptions = {
    scaleShowVerticalLines: false,

    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          min : 0,
          max : 10
        }
      }]
    }
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  // public barChartType = this.type;
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(){
    // let Data

    // // Data= this.data?.filter(a => a['UGL'] == this.ugl).map(a=>a[this.filtro])
    // // if (this.ugl == '' || this.ugl == "Todas") {
    // //   Data = this.data?.map(a=>a[this.filtro])
    // //   this.ugl = "Todas"
    // // }
    // if (this.data != undefined) {
    //   Data = this.data.map(a=>a[this.filtro])

    //   this.barChartData = [{data:Data,label:"Todas las UGLs"}]
    // }
    if (this.data != undefined) {

      // this.barChartData = [{data:this.data,label:this.filtro}]
      this.barChartData = this.data
      this.barChartLabels = this.label
      // console.log("22222222222",this.data,this.label);

    }
    // console.log("this.bubbleChartData",this.bubbleChartData,this.data)
    // console.log(this.barChartData);

  }

}

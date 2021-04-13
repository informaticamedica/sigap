import { Component, OnInit } from '@angular/core';
import { DatosDbService } from '../../servicios/datos-db.service'


@Component({
  selector: 'hoja-ugl',
  templateUrl: './hoja-ugl.component.html',
  styleUrls: ['./hoja-ugl.component.css']
})
export class HojaUglComponent implements OnInit {
  EvalAsis = 0;
  EvalFact = 0;
  EvalGlob = 0;
  CompAsis = ""
  CompFact = ""
  CompGlob = ""
  DatosRankingDeciloUglTotal: any;
  DatosDispersionUgl1: any;

  constructor(
    private datos: DatosDbService
  ) { }

  Datos
  Ugls
  // Prestadores

  dataGlobal
  labelGlobal
  ngOnInit(): void {

    this.datos.DatosApi().subscribe(
      res => {
        this.Datos = res
        this.Ugls = [... new Set(this.Datos.map(a => a.UGL))]
        this.Ugls.sort()


        // this.Prestadores = [... new Set(this.Datos.map(a => a.Prestador))]
        // console.log(this.Datos);
        // console.log(this.Ugls.sort());

        this.CalculoDispersionUgl()
        this.DatosDispersionUgl1 = this.DatosDispersionUgl

        this.DatosRankingDeciloUgl["Decilo Global"] = { Data: [], Label: [] }
        this.DatosRankingDeciloUgl["Decilo Facturación"] = { Data: [], Label: [] }
        this.DatosRankingDeciloUgl["Decilo Asistencial"] = { Data: [], Label: [] }
        
        this.CalculoRankingDeciloUgl("Decilo Global")

        this.CalculoRankingDeciloUgl("Decilo Facturación")
        this.CalculoRankingDeciloUgl("Decilo Asistencial")

        this.CalculoRankingDeciloUglTotal()



        // console.log(this.DatosRankingDeciloUgl);


        // let { Data, Label} = this.CalculoRankingDeciloUgl("Decilo Global")
        // this.DatosRankingDeciloUgl["Decilo Global"]["Data"] = Data
        // this.DatosRankingDeciloUgl["Decilo Global"]["Label"] = Label
        // console.log("this.DatosRankingDeciloUgl", this.DatosRankingDeciloUgl);

        // this.dataGlobal = this.DatosRankingDeciloUgl["Decilo Global"]['Data']
        // this.labelGlobal = this.DatosRankingDeciloUgl["Decilo Global"]['Label']
      }
    )
    // this.DatosDispersionUgl()

  }

  ugl_seleccionada = ''
  addItem(e) {
    this.ugl_seleccionada = e
    // console.log("eeeee", e);


    this.DatosDispersionUgl1 = this.DatosDispersionUgl.filter(a => a.label == e)

    let object = this.DatosRankingDeciloUgl
    var aux = {}
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];

        let index = element.Label.indexOf(e)
        // console.log("element", element, e, index, element.Data[0].data[index]);
        // console.log("key", key);

        aux[key] = { Data: [], Label: [] }
        aux[key]['Data'] = [{
          data: [element.Data[0].data[index]],
          label: key
        }]
        aux[key]['Label'] = [key]


      }
    }
    this.DatosRankingDeciloUgl = aux
    this.CalculoRankingDeciloUglTotal()
    // console.log("aux", aux);




  }

  DatosDispersionUgl
  CalculoDispersionUgl() {

    let aux = []
    if (this.Datos != undefined) {

      for (let index = 0; index < this.Datos.length; index++) {
        const element = this.Datos[index];
        const key = element['UGL']


        const count = this.Datos?.filter(a => a.UGL == key).length
        const fact = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr["Decilo Facturación"], 0)
        const asis = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr["Decilo Asistencial"], 0)

        if (!(aux.filter(b => b['label'] == key).length > 0)) {
          aux.push({
            data: [{
              x: (asis / count).toFixed(2),
              y: (fact / count).toFixed(2),
              r: count
            }], label: key
          })
        }


      }
    }


    // console.log("DatosDispersionUgl - formato",
    //   [
    //     {
    //       data: [
    //         { x: 1, y: 1, r: 10 }
    //       ],
    //       label: 'UGL 1',
    //     },
    //     {
    //       data: [
    //         { x: 3, y: 5, r: 22 }
    //       ],
    //       label: 'UGL 2',
    //     },
    //   ]
    // );
    // console.log("DatosDispersionUgl", aux, this.Datos);

    this.DatosDispersionUgl = aux.slice().sort(function (a, b) {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    console.log("this.DatosDispersionUgl",this.DatosDispersionUgl);



  }

  DatosRankingDeciloUgl = {}
  CalculoRankingDeciloUgl(Decilo) {


    let Label = []
    let Data = []
    if (this.Datos != undefined) {
      for (let index = 0; index < this.Datos.length; index++) {
        const element = this.Datos[index];
        const key = element['UGL']


        const count = this.Datos?.filter(a => a.UGL == key).length
        const global = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr[Decilo], 0)


        if (!(Label.filter(b => b == key).length > 0)) {
          Label.push(key)
          Data.push((global / count).toFixed(2))
        }

        

        // let aux = {}

        let aux2 =[]
        
        for (let index = 0; index < Label.length; index++) {
          const element = Label[index];

          // aux[element] = parseFloat( Data[index])

          aux2.push({ugl:element,decilo:parseFloat(Data[index])})
          
        }
        Label = aux2.sort( (a,b) => a.decilo - b.decilo ).map( a=> a.ugl)
        Data = aux2.sort( (a,b) => a.decilo - b.decilo ).map( a=> a.decilo)

        
        
        
// console.log(aux2);


        // if (!(aux.filter(b => b['Label'] == key).length > 0)) {
        //   aux.push({
        //     Label: key,
        //     Data: {
        //       data: [(global / count).toFixed(2)],
        //       label: Decilo
        //     }
        //   })
        // }


      }

      // for (let index = 0; index < this.Datos.length; index++) {
      //   const element = this.Datos[index];
      //   const key = element['UGL']

      //   const count = this.Datos?.filter(a => a.UGL == key).length
      //   const global = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr[Decilo], 0)

      // }
    }


    // console.log("DatosDispersionUgl - formato",
    //   [
    //     {
    //       data: [
    //         { x: 1, y: 1, r: 10 }
    //       ],
    //       label: 'UGL 1',
    //     },
    //     {
    //       data: [
    //         { x: 3, y: 5, r: 22 }
    //       ],
    //       label: 'UGL 2',
    //     },
    //   ]
    // );
    // console.log("DatosDispersionUgl", aux, this.Datos);

    // this.DatosRankingDeciloUgl[Decilo] = { Data, Label}

    // console.log("this.DatosRankingDeciloUgl[" + Decilo + "]", this.DatosRankingDeciloUgl[Decilo]);
    // this.dataGlobal = Data
    // this.labelGlobal = Label

    // this.DatosRankingDeciloUgl[Decilo]['Data'] = Data //[{data:this.data,label:this.filtro}]
    this.DatosRankingDeciloUgl[Decilo]['Data'] = [{ data: Data, label: Decilo }]
    this.DatosRankingDeciloUgl[Decilo]['Label'] = Label

    // return {Label , Data}

  }

  CalculoRankingDeciloUglTotal(){
    this.DatosRankingDeciloUglTotal = { Data: [], Label: [] }
    this.DatosRankingDeciloUglTotal['Label'] = this.DatosRankingDeciloUgl["Decilo Global"]['Label']
    this.DatosRankingDeciloUglTotal['Data'].push(
      this.DatosRankingDeciloUgl["Decilo Global"]['Data'][0])
    this.DatosRankingDeciloUglTotal['Data'].push(
      this.DatosRankingDeciloUgl["Decilo Facturación"]['Data'][0])
    this.DatosRankingDeciloUglTotal['Data'].push(
      this.DatosRankingDeciloUgl["Decilo Asistencial"]['Data'][0])
  }


  limpiar(e) {
    this.CalculoDispersionUgl()
    this.DatosDispersionUgl1 = this.DatosDispersionUgl
    this.CalculoRankingDeciloUgl("Decilo Global")
    this.CalculoRankingDeciloUgl("Decilo Facturación")
    this.CalculoRankingDeciloUgl("Decilo Asistencial")
    this.CalculoRankingDeciloUglTotal()
    // console.log("limpiar", e);
  }

  ngOnChanges(){
    
  }
  cambiaLado(e){
    // console.log("EvalAsis",this.EvalAsis);
    // console.log("EvalFact",this.EvalFact);
    // console.log("EvalGlob",this.EvalGlob);
    // console.log("CompAsis",this.CompAsis);
    // console.log("CompFact",this.CompFact);
    // console.log("CompGlob",this.CompGlob);
    // console.log("e",e);

    // this.DatosDispersionUgl = this.DatosDispersionUgl.filter(a => a.label == e)

    let comparar = (a,comp,b)=>{

      switch (comp) {
        case "=":
          return a == b
          break;
        case ">":
          return a > b
          break;
        case "<":
          return a < b
          break;
      
        default:
          break;
      }


    }
    
    this.DatosDispersionUgl1 =this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)).filter(a=>comparar (parseFloat(a.data[0].y),this.CompFact,this.EvalFact))
    
    // console.log("this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)));
    
    // console.log("222222222this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)).filter(a=>comparar (parseFloat(a.data[0].y),this.CompFact,this.EvalFact)));
  }
}

import { Component, OnInit } from '@angular/core';
import { DatosDbService } from 'src/app/servicios/datos-db.service';

@Component({
  selector: 'hoja-prestador',
  templateUrl: './hoja-prestador.component.html',
  styleUrls: ['./hoja-prestador.component.css']
})
export class HojaPrestadorComponent implements OnInit {


  EvalAsis = 0;
  EvalFact = 0;
  EvalGlob = 0;
  CompAsis = ""
  CompFact = ""
  CompGlob = ""
  DatosRankingDeciloUglTotal: any;
  DatosDispersionUgl1: any;
  DatosDispersionPrestador: any;
  DatosDispersionPrestador1: any;
  DatosRankingDeciloPrestador: any;
  DatosRankingDeciloTotal= {};

  constructor(
    private datos: DatosDbService
  ) { }

  Datos
  Ugls
  Prestadores

  dataGlobal
  labelGlobal
  ngOnInit(): void {

    this.datos.DatosApi().subscribe(
      res => {
        this.Datos = res
        this.Ugls = [... new Set(this.Datos.map(a => a.UGL))]
        this.Ugls.sort()


        this.Prestadores = [... new Set(this.Datos.map(a => a.Prestador))]


        this.CalculoDispersionUgl()

        this.DatosDispersionUgl1 = this.CalculoDispersion(res,'UGL')
        this.DatosRankingDeciloUgl["Decilo Global"] = this.CalculoRankingDecilo(res,'UGL',"Decilo Global")
        this.DatosRankingDeciloUgl["Decilo Facturación"] = this.CalculoRankingDecilo(res,'UGL',"Decilo Facturación")
        this.DatosRankingDeciloUgl["Decilo Asistencial"] = this.CalculoRankingDecilo(res,'UGL',"Decilo Asistencial")
   
        this.CalculoRankingDeciloUglTotal()
        this.DatosRankingDecilo["UGL"]={}
        // this.CalculoRankingDeciloTotal("UGL")


        
        // this.CalculoDispersionPrestador()
        // this.DatosDispersionPrestador1 = this.DatosDispersionPrestador

        // this.DatosRankingDeciloPrestador["Decilo Global"] = { Data: [], Label: [] }
        // this.DatosRankingDeciloPrestador["Decilo Facturación"] = { Data: [], Label: [] }
        // this.DatosRankingDeciloPrestador["Decilo Asistencial"] = { Data: [], Label: [] }
        
        // this.CalculoRankingDeciloPrestador("Decilo Global")

        // this.CalculoRankingDeciloPrestador("Decilo Facturación")
        // this.CalculoRankingDeciloPrestador("Decilo Asistencial")

        // this.CalculoRankingDeciloPrestadorTotal()



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
  CalculoRankingDeciloPrestadorTotal() {
    throw new Error('Method not implemented.');
  }
  CalculoRankingDeciloPrestador(arg0: string) {
    throw new Error('Method not implemented.');
  }
  CalculoDispersionPrestador() {
    // throw new Error('Method not implemented.');
  }

  ugl_seleccionada = ''
  addItem(e) {

    console.log(this.Prestadores);
    console.log(this.Datos);
    
    console.log(e);
    

    // this.ugl_seleccionada = e


    // this.DatosDispersionUgl1 = this.DatosDispersionUgl.filter(a => a.label == e)

    // let object = this.DatosRankingDeciloUgl
    // var aux = {}
    // for (const key in object) {
    //   if (Object.prototype.hasOwnProperty.call(object, key)) {
    //     const element = object[key];

    //     let index = element.Label.indexOf(e)
    //     // console.log("element", element, e, index, element.Data[0].data[index]);
    //     // console.log("key", key);

    //     aux[key] = { Data: [], Label: [] }
    //     aux[key]['Data'] = [{
    //       data: [element.Data[0].data[index]],
    //       label: key
    //     }]
    //     aux[key]['Label'] = [key]


    //   }
    // }
    // this.DatosRankingDeciloUgl = aux
    // this.CalculoRankingDeciloUglTotal()
    // // console.log("aux", aux);




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
  DatosDispersion
  CalculoDispersion(Datos,entidad) {

    let aux = []
    if (Datos != undefined) {

      for (let index = 0; index < Datos.length; index++) {
        const element = Datos[index];
        const key = element[entidad]


        const count = Datos?.filter(a => a.UGL == key).length
        const fact = Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr["Decilo Facturación"], 0)
        const asis = Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr["Decilo Asistencial"], 0)

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

    // this.DatosDispersionUgl =
    return aux.slice().sort(function (a, b) {
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
  DatosRankingDecilo = {}
  CalculoRankingDecilo(Datos,entidad,Decilo) {


    let Label = []
    let Data = []
    if (Datos != undefined) {
      for (let index = 0; index < Datos.length; index++) {
        const element = Datos[index];
        const key = element[entidad]


        const count = Datos?.filter(a => a.UGL == key).length
        const global = Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr[Decilo], 0)


        if (!(Label.filter(b => b == key).length > 0)) {
          Label.push(key)
          Data.push((global / count).toFixed(2))
        }

        let aux2 =[]
        
        for (let index = 0; index < Label.length; index++) {
          const element = Label[index];


          aux2.push({ugl:element,decilo:parseFloat(Data[index])})
          
        }
        Label = aux2.sort( (a,b) => a.decilo - b.decilo ).map( a=> a.ugl)
        Data = aux2.sort( (a,b) => a.decilo - b.decilo ).map( a=> a.decilo)

        

      }


    }

    let DatosRankingDecilo= {}
    DatosRankingDecilo['Data'] = [{ data: Data, label: Decilo }]
    DatosRankingDecilo['Label'] = Label
    // console.log("DatosRankingDecilo",DatosRankingDecilo);
    // this.DatosRankingDeciloUgl[Decilo]['Data'] = [{ data: Data, label: Decilo }]
    // debugger
    // const lala = JSON.stringify(DatosRankingDecilo)
    // console.log("lala",lala);
    
    return DatosRankingDecilo

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
  CalculoRankingDeciloTotal(entidad){
    this.DatosRankingDeciloTotal[entidad] = { Data: [], Label: [] }
    console.log("this.DatosRankingDecilo[entidad]",this.DatosRankingDecilo);
    
    this.DatosRankingDeciloTotal[entidad]['Label'] = this.DatosRankingDecilo[entidad]["Decilo Global"]['Label']
    this.DatosRankingDeciloTotal[entidad]['Data'].push(
      this.DatosRankingDecilo[entidad]["Decilo Global"]['Data'][0])
    this.DatosRankingDeciloTotal[entidad]['Data'].push(
      this.DatosRankingDecilo[entidad]["Decilo Facturación"]['Data'][0])
    this.DatosRankingDeciloTotal[entidad]['Data'].push(
      this.DatosRankingDecilo[entidad]["Decilo Asistencial"]['Data'][0])
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

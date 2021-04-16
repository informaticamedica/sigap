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
  // DatosDispersionPrestador1: any;
  DatosRankingDeciloPrestador: any;
  DatosRankingDeciloTotal = {};
  prestador_seleccionado = '';

  constructor(
    private datos: DatosDbService
  ) { }

  Datos
  Ugls
  Prestadores

  dataGlobal
  labelGlobal
  ngOnInit(): void {
    this.DatosRankingDecilo['UGL'] = {}
    this.DatosRankingDecilo['UGL']["Decilo Global"] = {}
    this.DatosRankingDecilo['Prestador'] = {}
    this.DatosRankingDecilo['Prestador']["Decilo Global"] = {}

    this.datos.DatosApi().subscribe(
      res => {
        this.Datos = res
        this.Ugls = [... new Set(this.Datos.map(a => a.UGL))]
        this.Ugls.sort()

        console.log(res);
        
        this.Prestadores = [... new Set(this.Datos.map(a => a.Prestador))]
        this.Prestadores.sort()

        this.DatosDispersionPrestador = this.CalculoDispersion(res, 'Prestador')
        this.DatosDispersionUgl1 = this.CalculoDispersion(res, 'UGL')

        this.DatosRankingDecilo['UGL']["Decilo Global"] = this.CalculoRankingDecilo(res, 'UGL', "Decilo Global")
        this.DatosRankingDecilo['UGL']["Decilo Facturación"] = this.CalculoRankingDecilo(res, 'UGL', "Decilo Facturación")
        this.DatosRankingDecilo['UGL']["Decilo Asistencial"] = this.CalculoRankingDecilo(res, 'UGL', "Decilo Asistencial")

        this.DatosRankingDecilo['Prestador']["Decilo Global"] = this.CalculoRankingDecilo(res, 'Prestador', "Decilo Global")
        this.DatosRankingDecilo['Prestador']["Decilo Facturación"] = this.CalculoRankingDecilo(res, 'Prestador', "Decilo Facturación")
        this.DatosRankingDecilo['Prestador']["Decilo Asistencial"] = this.CalculoRankingDecilo(res, 'Prestador', "Decilo Asistencial")

        this.DatosRankingDeciloTotal = this.CalculoRankingDeciloTotal("UGL", this.DatosRankingDeciloTotal, this.DatosRankingDecilo)
        this.DatosRankingDeciloTotal = this.CalculoRankingDeciloTotal("Prestador", this.DatosRankingDeciloTotal, this.DatosRankingDecilo)

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
  addItem(e, entidad) {

    // console.log(this.Prestadores);
    // console.log(this.Datos);

    // console.log(e, entidad);

    switch (entidad) {
      case "Prestador": this.prestador_seleccionado = e
        break;
      case "UGL":
        this.ugl_seleccionada = e
        this.Prestadores = [... new Set(this.Datos.filter(a => a.UGL == this.ugl_seleccionada).map(a => a.Prestador))]
        break;
      default: break;
    }



    // this.DatosDispersionUgl1 = this.CalculoDispersion(this.Datos, 'UGL').filter(a => a.label == e)
    let Datos = this.Datos

    if (this.ugl_seleccionada != '') {
      Datos = Datos.filter(a => a.UGL == this.ugl_seleccionada)
    }

    this.DatosDispersionPrestador = this.CalculoDispersion(Datos, 'Prestador')
    if (this.prestador_seleccionado != '') {
      this.DatosDispersionPrestador = this.DatosDispersionPrestador.filter(a => a.label == this.prestador_seleccionado)

    }

    // debugger

  }


  DatosDispersion
  CalculoDispersion(Datos, entidad) {

    let aux = []
    if (Datos != undefined) {

      for (let index = 0; index < Datos.length; index++) {
        const element = Datos[index];
        const key = element[entidad]

        // if (entidad == "Prestador") {

        //   debugger
        // }


        const count = Datos?.filter(a => a[entidad] == key).length
        const fact = Datos?.filter(a => a[entidad] == key).reduce((acc, curr) => acc + curr["Decilo Facturación"], 0)
        const asis = Datos?.filter(a => a[entidad] == key).reduce((acc, curr) => acc + curr["Decilo Asistencial"], 0)

        if (!(aux.filter(b => b['label'] == key).length > 0)) {
          aux.push({
            data: [{
              x: (asis / count).toFixed(2),
              y: (fact / count).toFixed(2),
              r: entidad == 'Prestador' ? count * 5 : count
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




  }


  DatosRankingDecilo = {}

  CalculoRankingDecilo(Datos, entidad, Decilo) {


    let Label = []
    let Data = []
    if (Datos != undefined) {
      for (let index = 0; index < Datos.length; index++) {
        const element = Datos[index];
        const key = element[entidad]


        const count = Datos?.filter(a => a[entidad] == key).length
        const global = Datos?.filter(a => a[entidad] == key).reduce((acc, curr) => acc + curr[Decilo], 0)


        if (!(Label.filter(b => b == key).length > 0)) {
          Label.push(key)
          Data.push((global / count).toFixed(2))
        }

        let aux2 = []

        for (let index = 0; index < Label.length; index++) {
          const element = Label[index];


          aux2.push({ [entidad]: element, decilo: parseFloat(Data[index]) })

        }
        Label = aux2.sort((a, b) => a.decilo - b.decilo).map(a => a[entidad])
        Data = aux2.sort((a, b) => a.decilo - b.decilo).map(a => a.decilo)



      }


    }

    let DatosRankingDecilo = {}
    DatosRankingDecilo['Data'] = [{ data: Data, label: Decilo }]
    DatosRankingDecilo['Label'] = Label
    // console.log("DatosRankingDecilo",DatosRankingDecilo);
    // this.DatosRankingDeciloUgl[Decilo]['Data'] = [{ data: Data, label: Decilo }]
    // debugger
    // const lala = JSON.stringify(DatosRankingDecilo)
    // console.log("lala",lala);

    return DatosRankingDecilo

  }

  // CalculoRankingDeciloUglTotal() {
  //   this.DatosRankingDeciloUglTotal = { Data: [], Label: [] }
  //   this.DatosRankingDeciloUglTotal['Label'] = this.DatosRankingDeciloUgl["Decilo Global"]['Label']
  //   this.DatosRankingDeciloUglTotal['Data'].push(
  //     this.DatosRankingDeciloUgl["Decilo Global"]['Data'][0])
  //   this.DatosRankingDeciloUglTotal['Data'].push(
  //     this.DatosRankingDeciloUgl["Decilo Facturación"]['Data'][0])
  //   this.DatosRankingDeciloUglTotal['Data'].push(
  //     this.DatosRankingDeciloUgl["Decilo Asistencial"]['Data'][0])
  // }
  CalculoRankingDeciloTotal(entidad, DatosRankingDeciloTotal, DatosRankingDecilo) {
    DatosRankingDeciloTotal[entidad] = { Data: [], Label: [] }
    // console.log("DatosRankingDeciloTotal", DatosRankingDeciloTotal);
    // console.log('DatosRankingDecilo[entidad]["Decilo Global"]["Label"]', DatosRankingDecilo);

    DatosRankingDeciloTotal[entidad]['Label'] = DatosRankingDecilo[entidad]["Decilo Global"]['Label']
    DatosRankingDeciloTotal[entidad]['Data'].push(
      DatosRankingDecilo[entidad]["Decilo Global"]['Data'][0])
    DatosRankingDeciloTotal[entidad]['Data'].push(
      DatosRankingDecilo[entidad]["Decilo Facturación"]['Data'][0])
    DatosRankingDeciloTotal[entidad]['Data'].push(
      DatosRankingDecilo[entidad]["Decilo Asistencial"]['Data'][0])
    return DatosRankingDeciloTotal
  }


  limpiar(e, entidad) {

    // switch (entidad) {
    //   case "Prestador": this.prestador_seleccionado = e
    //     break;
    //   case "UGL":
    //     this.ugl_seleccionada = e
    //     this.Prestadores = [... new Set(this.Datos.filter(a => a.UGL == this.ugl_seleccionada).map(a => a.Prestador))]
    //     break;
    //   default: break;
    // }

    let Datos = this.Datos
    if (entidad == "Prestador") {
      Datos = Datos.filter(a => a.UGL == this.ugl_seleccionada)
      this.prestador_seleccionado = ''
    }
    if (entidad == "UGL") {
      this.ugl_seleccionada = ''
    }

    this.DatosDispersionPrestador = this.CalculoDispersion(Datos, 'Prestador')

    // this.DatosDispersionPrestador = this.CalculoDispersion(this.Datos, 'Prestador')
    // this.DatosDispersionUgl1 = this.CalculoDispersion(this.Datos, 'UGL')

    // this.DatosRankingDecilo['UGL']["Decilo Global"] = this.CalculoRankingDecilo(this.Datos, 'UGL', "Decilo Global")
    // this.DatosRankingDecilo['UGL']["Decilo Facturación"] = this.CalculoRankingDecilo(this.Datos, 'UGL', "Decilo Facturación")
    // this.DatosRankingDecilo['UGL']["Decilo Asistencial"] = this.CalculoRankingDecilo(this.Datos, 'UGL', "Decilo Asistencial")

    // this.DatosRankingDecilo['Prestador']["Decilo Global"] = this.CalculoRankingDecilo(this.Datos, 'Prestador', "Decilo Global")
    // this.DatosRankingDecilo['Prestador']["Decilo Facturación"] = this.CalculoRankingDecilo(this.Datos, 'Prestador', "Decilo Facturación")
    // this.DatosRankingDecilo['Prestador']["Decilo Asistencial"] = this.CalculoRankingDecilo(this.Datos, 'Prestador', "Decilo Asistencial")

    // this.DatosRankingDeciloTotal = this.CalculoRankingDeciloTotal("UGL", this.DatosRankingDeciloTotal, this.DatosRankingDecilo)
    // this.DatosRankingDeciloTotal = this.CalculoRankingDeciloTotal("Prestador", this.DatosRankingDeciloTotal, this.DatosRankingDecilo)
  }


  cambiaLado(e) {
    // console.log("EvalAsis",this.EvalAsis);
    // console.log("EvalFact",this.EvalFact);
    // console.log("EvalGlob",this.EvalGlob);
    // console.log("CompAsis",this.CompAsis);
    // console.log("CompFact",this.CompFact);
    // console.log("CompGlob",this.CompGlob);
    // console.log("e",e);

    // this.DatosDispersionUgl = this.DatosDispersionUgl.filter(a => a.label == e)

    let comparar = (a, comp, b) => {

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

    this.DatosDispersionUgl1 = this.CalculoDispersion(this.Datos, 'UGL').filter(a => comparar(parseFloat(a.data[0].x), this.CompAsis, this.EvalAsis)).filter(a => comparar(parseFloat(a.data[0].y), this.CompFact, this.EvalFact))

    this.DatosDispersionPrestador = this.CalculoDispersion(this.Datos, 'Prestador').filter(a => comparar(parseFloat(a.data[0].x), this.CompAsis, this.EvalAsis)).filter(a => comparar(parseFloat(a.data[0].y), this.CompFact, this.EvalFact))

    // console.log("this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)));

    // console.log("222222222this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)).filter(a=>comparar (parseFloat(a.data[0].y),this.CompFact,this.EvalFact)));
  }

}

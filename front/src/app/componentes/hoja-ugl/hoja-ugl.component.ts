import { Component, OnInit, OnChanges } from '@angular/core';
import { DatosDbService } from 'src/app/servicios/datos-db.service';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'hoja-ugl',
  templateUrl: './hoja-ugl.component.html',
  styleUrls: ['./hoja-ugl.component.css'],
})
export class HojaUglComponent implements OnInit {
  DatosDispersionUgl1: any;
  DatosDispersionPrestador: any;
  // DatosDispersionPrestador1: any;
  DatosRankingDeciloPrestador: any;
  DatosRankingDeciloTotal = {};
  prestador_seleccionado = '';
  Datos;
  Ugls;
  Prestadores;
  dataGlobal;
  labelGlobal;
  ugl_seleccionada = '';
  DatosDispersion;
  DatosRankingDecilo = {};
  // value: number = 100;

  evalAsis = [0, 10];
  evalFact = [0, 10];
  evalGlob = [0, 10];

  valAsisMin = 0;
  valFactMin = 0;
  valGlobMin = 0;

  valAsisMax = 10;
  valFactMax = 10;
  valGlobMax = 10;

  opcAsis: Options = this.optionSlider('Asistencial');
  opcFact: Options = this.optionSlider('Administrativo');
  opcGlob: Options = this.optionSlider('Global');
  // minValue: number = 0;
  // maxValue: number = 10;
  // options: Options = {
  //   floor: 0,
  //   ceil: 10,
  //   translate: (value: number, label: LabelType): string => {
  //     switch (label) {
  //       case LabelType.Low:
  //         return "<b>Min Asistencial</b> " + value;
  //       case LabelType.High:
  //         return "<b>Max Asistencial:</b> " + value;
  //       default:
  //         return "" + value;
  //     }
  //   }
  // };

  optionSlider(desilo) {
    return {
      floor: 0,
      ceil: 10,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>Min ' + desilo + '</b> ' + value;
          case LabelType.High:
            return '<b>Max ' + desilo + ':</b> ' + value;
          default:
            return '' + value;
        }
      },
    };
  }

  constructor(private datos: DatosDbService) {}

  ngOnInit(): void {
    this.DatosRankingDecilo['UGL'] = {};
    this.DatosRankingDecilo['UGL']['Decilo Global'] = {};
    this.DatosRankingDecilo['Prestador'] = {};
    this.DatosRankingDecilo['Prestador']['Decilo Global'] = {};

    this.datos.DatosApi().subscribe((res) => {
      this.Datos = res;
      // this.Ugls = [...new Set(this.Datos.map((a) => a.UGL))];
      // this.Ugls.sort();

      // console.log(res);

      // this.Prestadores = [...new Set(this.Datos.map((a) => a.Prestador))];
      // this.Prestadores.sort();

      this.initDatos(this.Datos);
    });
  }

  initDatos(Datos) {
    this.Ugls = [...new Set(Datos.map((a) => a.UGL))];
    this.Ugls.sort();

    // console.log(res);

    this.Prestadores = [...new Set(Datos.map((a) => a.Prestador))];
    this.Prestadores.sort();
    this.DatosDispersionPrestador = this.CalculoDispersion(Datos, 'Prestador');
    this.DatosDispersionUgl1 = this.CalculoDispersion(Datos, 'UGL');
    console.log('asd', Datos);

    this.DatosRankingDecilo['UGL']['Decilo Global'] = this.CalculoRankingDecilo(
      Datos,
      'UGL',
      'Decilo Global'
    );
    this.DatosRankingDecilo['UGL'][
      'Decilo Facturación'
    ] = this.CalculoRankingDecilo(Datos, 'UGL', 'Decilo Facturación');
    this.DatosRankingDecilo['UGL'][
      'Decilo Asistencial'
    ] = this.CalculoRankingDecilo(Datos, 'UGL', 'Decilo Asistencial');

    this.DatosRankingDecilo['Prestador'][
      'Decilo Global'
    ] = this.CalculoRankingDecilo(Datos, 'Prestador', 'Decilo Global');
    this.DatosRankingDecilo['Prestador'][
      'Decilo Facturación'
    ] = this.CalculoRankingDecilo(Datos, 'Prestador', 'Decilo Facturación');
    this.DatosRankingDecilo['Prestador'][
      'Decilo Asistencial'
    ] = this.CalculoRankingDecilo(Datos, 'Prestador', 'Decilo Asistencial');

    this.DatosRankingDeciloTotal = this.CalculoRankingDeciloTotal(
      'UGL',
      this.DatosRankingDeciloTotal,
      this.DatosRankingDecilo
    );
    this.DatosRankingDeciloTotal = this.CalculoRankingDeciloTotal(
      'Prestador',
      this.DatosRankingDeciloTotal,
      this.DatosRankingDecilo
    );
  }

  calcular() {
    let datos = this.Datos;

    //  Decilo Asistencial
    //  Decilo Facturación
    //  Decilo Global
    datos = datos?.filter(
      (a) =>
        a['Decilo Asistencial'] >= this.evalAsis[0] &&
        a['Decilo Asistencial'] <= this.evalAsis[1]
    );
    datos = datos?.filter(
      (a) =>
        a['Decilo Facturación'] >= this.evalFact[0] &&
        a['Decilo Facturación'] <= this.evalFact[1]
    );
    datos = datos?.filter(
      (a) =>
        a['Decilo Global'] >= this.evalGlob[0] &&
        a['Decilo Global'] <= this.evalGlob[1]
    );

    // console.log(this.evalAsis, this.evalFact, this.evalGlob);
    this.initDatos(datos);
  }

  onChange(valores, entidad) {
    // let datos = this.Datos?.filter(a => a[entidad] >= valores[0] && a[entidad] <= valores[1] )
    // console.log(entidad,valores,datos );
    // this.initDatos(datos)
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

  addItem(e, entidad) {
    // console.log(this.Prestadores);
    // console.log(this.Datos);

    // console.log(e, entidad);

    // switch (entidad) {
    //   case 'Prestador':
    //     this.prestador_seleccionado = e;
    //     break;
    //   case 'UGL':
    //     this.ugl_seleccionada = e;
    //     this.Prestadores = [
    //       ...new Set(
    //         this.Datos.filter((a) => a.UGL == this.ugl_seleccionada).map(
    //           (a) => a.Prestador
    //         )
    //       ),
    //     ];
    //     break;
    //   default:
    //     break;
    // }
    this.ugl_seleccionada = e;
    // this.DatosDispersionUgl1 = this.CalculoDispersion(this.Datos, 'UGL').filter(a => a.label == e)
    let Datos = this.Datos;

    if (this.ugl_seleccionada != '') {
      Datos = Datos.filter((a) => a.UGL == this.ugl_seleccionada);
    }

    this.initDatos(Datos);

    // this.DatosDispersionPrestador = this.CalculoDispersion(Datos, 'Prestador');
    // if (this.prestador_seleccionado != '') {
    //   this.DatosDispersionPrestador = this.DatosDispersionPrestador.filter(
    //     (a) => a.label == this.prestador_seleccionado
    //   );
    // }

    // debugger
  }

  CalculoDispersion(Datos, entidad) {
    let aux = [];
    if (Datos != undefined) {
      for (let index = 0; index < Datos.length; index++) {
        const element = Datos[index];
        const key = element[entidad];

        // if (entidad == "Prestador") {

        //   debugger
        // }

        const count = Datos?.filter((a) => a[entidad] == key).length;
        const fact = Datos?.filter((a) => a[entidad] == key).reduce(
          (acc, curr) => acc + curr['Decilo Facturación'],
          0
        );
        const asis = Datos?.filter((a) => a[entidad] == key).reduce(
          (acc, curr) => acc + curr['Decilo Asistencial'],
          0
        );

        if (!(aux.filter((b) => b['label'] == key).length > 0)) {
          aux.push({
            data: [
              {
                x: (asis / count).toFixed(2),
                y: (fact / count).toFixed(2),
                r: entidad == 'Prestador' ? count * 5 : count / 2,
              },
            ],
            label: key,
          });
        }
      }
    }

    const modularizadorTrucho = (vecPosta, modulo) => {
      let vec = vecPosta.map((a) => parseFloat(a.toFixed(1)));
      vec.sort((a, b) => a - b);
      // debugger;
      const min = parseFloat(vec[0]);
      const max = parseFloat(vec[vec.length - 1]);
      const val = max - min;
      const valDiv = modulo / val / 10;
      let auxxx = [];
      auxxx[min * 10] = 0;
      // let auxx = [...new Set(vec)];

      for (let index = min * 10 + 1; index < min * 10 + val * 10; index++) {
        auxxx[index] = parseFloat((auxxx[index - 1] + valDiv).toFixed(1));
      }
      auxxx[auxxx.length] = 255;
      // debugger;
      return auxxx;
    };
    let auxvec = aux.map((a) => {
      let val = parseFloat(a.data[0].x) + parseFloat(a.data[0].y);
      val = val / 2;
      return val;
    });
    let modu = modularizadorTrucho(auxvec, 255);
    aux.forEach((a) => {
      // let val: number = parseFloat(a.data[0].x) + parseFloat(a.data[0].y);
      const aa = parseFloat(a.data[0].x);
      const bb = parseFloat(a.data[0].y);
      const cc = (aa + bb) / 2;
      const dd = modu[parseFloat(cc.toFixed(1)) * 10];
      // cc = (aa + bb);
      // cc = (aa + bb) / 2;

      // debugger;
      if (
        cc == undefined ||
        aa == undefined ||
        bb == undefined ||
        dd == undefined
      ) {
        debugger;
        var val;
        val = aa + bb;
        val = val / 2;
        val = parseFloat(val.toFixed(1));
        val = modu[val * 10];
        debugger;
      }

      let r = (255 - dd).toFixed();
      let g = dd.toFixed();
      a.backgroundColor = 'rgb(' + r + ',' + g + ',0)';
      // debugger;
    });

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
    });
  }

  CalculoRankingDecilo(Datos, entidad, Decilo) {
    let Label = [];
    let Data = [];
    if (Datos != undefined) {
      for (let index = 0; index < Datos.length; index++) {
        const element = Datos[index];
        const key = element[entidad];

        const count = Datos?.filter((a) => a[entidad] == key).length;
        const global = Datos?.filter((a) => a[entidad] == key).reduce(
          (acc, curr) => acc + curr[Decilo],
          0
        );

        if (!(Label.filter((b) => b == key).length > 0)) {
          Label.push(key);
          Data.push((global / count).toFixed(2));
        }

        let aux2 = [];

        for (let index = 0; index < Label.length; index++) {
          const element = Label[index];

          aux2.push({ [entidad]: element, decilo: parseFloat(Data[index]) });
        }
        Label = aux2.sort((a, b) => a.decilo - b.decilo).map((a) => a[entidad]);
        Data = aux2.sort((a, b) => a.decilo - b.decilo).map((a) => a.decilo);
      }
    }

    let DatosRankingDecilo = {};
    DatosRankingDecilo['Data'] = [{ data: Data, label: Decilo }];
    DatosRankingDecilo['Label'] = Label;
    // console.log("DatosRankingDecilo",DatosRankingDecilo);
    // this.DatosRankingDeciloUgl[Decilo]['Data'] = [{ data: Data, label: Decilo }]
    // debugger
    // const lala = JSON.stringify(DatosRankingDecilo)
    // console.log("lala",lala);

    return DatosRankingDecilo;
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
  CalculoRankingDeciloTotal(
    entidad,
    DatosRankingDeciloTotal,
    DatosRankingDecilo
  ) {
    DatosRankingDeciloTotal[entidad] = { Data: [], Label: [] };
    // console.log("DatosRankingDeciloTotal", DatosRankingDeciloTotal);
    // console.log('DatosRankingDecilo[entidad]["Decilo Global"]["Label"]', DatosRankingDecilo);

    DatosRankingDeciloTotal[entidad]['Label'] =
      DatosRankingDecilo[entidad]['Decilo Global']['Label'];
    DatosRankingDeciloTotal[entidad]['Data'].push(
      DatosRankingDecilo[entidad]['Decilo Global']['Data'][0]
    );
    DatosRankingDeciloTotal[entidad]['Data'].push(
      DatosRankingDecilo[entidad]['Decilo Facturación']['Data'][0]
    );
    DatosRankingDeciloTotal[entidad]['Data'].push(
      DatosRankingDecilo[entidad]['Decilo Asistencial']['Data'][0]
    );
    return DatosRankingDeciloTotal;
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

    let Datos = this.Datos;
    if (entidad == 'Prestador') {
      Datos = Datos.filter((a) => a.UGL == this.ugl_seleccionada);
      this.prestador_seleccionado = '';
    }
    if (entidad == 'UGL') {
      this.ugl_seleccionada = '';
    }

    // this.DatosDispersionPrestador = this.CalculoDispersion(Datos, 'Prestador');

    this.initDatos(Datos);

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

  // cambiaLado(e) {
  //   // console.log("EvalAsis",this.EvalAsis);
  //   // console.log("EvalFact",this.EvalFact);
  //   // console.log("EvalGlob",this.EvalGlob);
  //   // console.log("CompAsis",this.CompAsis);
  //   // console.log("CompFact",this.CompFact);
  //   // console.log("CompGlob",this.CompGlob);
  //   // console.log("e",e);

  //   // this.DatosDispersionUgl = this.DatosDispersionUgl.filter(a => a.label == e)

  //   let comparar = (a, comp, b) => {
  //     switch (comp) {
  //       case '=':
  //         return a == b;
  //         break;
  //       case '>':
  //         return a > b;
  //         break;
  //       case '<':
  //         return a < b;
  //         break;

  //       default:
  //         break;
  //     }
  //   };

  //   this.DatosDispersionUgl1 = this.CalculoDispersion(this.Datos, 'UGL')
  //     .filter((a) =>
  //       comparar(parseFloat(a.data[0].x), this.CompAsis, this.EvalAsis)
  //     )
  //     .filter((a) =>
  //       comparar(parseFloat(a.data[0].y), this.CompFact, this.EvalFact)
  //     );

  //   this.DatosDispersionPrestador = this.CalculoDispersion(
  //     this.Datos,
  //     'Prestador'
  //   )
  //     .filter((a) =>
  //       comparar(parseFloat(a.data[0].x), this.CompAsis, this.EvalAsis)
  //     )
  //     .filter((a) =>
  //       comparar(parseFloat(a.data[0].y), this.CompFact, this.EvalFact)
  //     );

  //   // console.log("this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)));

  //   // console.log("222222222this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)).filter(a=>comparar (parseFloat(a.data[0].y),this.CompFact,this.EvalFact)));
  // }
}
//   EvalAsis = 0;
//   EvalFact = 0;
//   EvalGlob = 0;
//   CompAsis = ""
//   CompFact = ""
//   CompGlob = ""
//   DatosRankingDeciloUglTotal: any;
//   DatosDispersionUgl1: any;

//   constructor(
//     private datos: DatosDbService
//   ) { }

//   Datos
//   Ugls
//   // Prestadores

//   dataGlobal
//   labelGlobal
//   ngOnInit(): void {

//     this.datos.DatosApi().subscribe(
//       res => {
//         this.Datos = res
//         this.Ugls = [... new Set(this.Datos.map(a => a.UGL))]
//         this.Ugls.sort()

//         // this.Prestadores = [... new Set(this.Datos.map(a => a.Prestador))]
//         // console.log(this.Datos);
//         // console.log(this.Ugls.sort());

//         this.CalculoDispersionUgl()
//         this.DatosDispersionUgl1 = this.DatosDispersionUgl

//         this.DatosRankingDeciloUgl["Decilo Global"] = { Data: [], Label: [] }
//         this.DatosRankingDeciloUgl["Decilo Facturación"] = { Data: [], Label: [] }
//         this.DatosRankingDeciloUgl["Decilo Asistencial"] = { Data: [], Label: [] }

//         this.CalculoRankingDeciloUgl("Decilo Global")

//         this.CalculoRankingDeciloUgl("Decilo Facturación")
//         this.CalculoRankingDeciloUgl("Decilo Asistencial")

//         this.CalculoRankingDeciloUglTotal()

//         // console.log(this.DatosRankingDeciloUgl);

//         // let { Data, Label} = this.CalculoRankingDeciloUgl("Decilo Global")
//         // this.DatosRankingDeciloUgl["Decilo Global"]["Data"] = Data
//         // this.DatosRankingDeciloUgl["Decilo Global"]["Label"] = Label
//         // console.log("this.DatosRankingDeciloUgl", this.DatosRankingDeciloUgl);

//         // this.dataGlobal = this.DatosRankingDeciloUgl["Decilo Global"]['Data']
//         // this.labelGlobal = this.DatosRankingDeciloUgl["Decilo Global"]['Label']
//       }
//     )
//     // this.DatosDispersionUgl()

//   }

//   ugl_seleccionada = ''
//   addItem(e) {
//     this.ugl_seleccionada = e
//     // console.log("eeeee", e);

//     this.DatosDispersionUgl1 = this.DatosDispersionUgl.filter(a => a.label == e)

//     let object = this.DatosRankingDeciloUgl
//     var aux = {}
//     for (const key in object) {
//       if (Object.prototype.hasOwnProperty.call(object, key)) {
//         const element = object[key];

//         let index = element.Label.indexOf(e)
//         // console.log("element", element, e, index, element.Data[0].data[index]);
//         // console.log("key", key);

//         aux[key] = { Data: [], Label: [] }
//         aux[key]['Data'] = [{
//           data: [element.Data[0].data[index]],
//           label: key
//         }]
//         aux[key]['Label'] = [key]

//       }
//     }
//     this.DatosRankingDeciloUgl = aux
//     this.CalculoRankingDeciloUglTotal()
//     // console.log("aux", aux);

//   }

//   DatosDispersionUgl
//   CalculoDispersionUgl() {

//     let aux = []
//     if (this.Datos != undefined) {

//       for (let index = 0; index < this.Datos.length; index++) {
//         const element = this.Datos[index];
//         const key = element['UGL']

//         const count = this.Datos?.filter(a => a.UGL == key).length
//         const fact = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr["Decilo Facturación"], 0)
//         const asis = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr["Decilo Asistencial"], 0)

//         if (!(aux.filter(b => b['label'] == key).length > 0)) {
//           aux.push({
//             data: [{
//               x: (asis / count).toFixed(2),
//               y: (fact / count).toFixed(2),
//               r: count
//             }], label: key
//           })
//         }

//       }
//     }

//     // console.log("DatosDispersionUgl - formato",
//     //   [
//     //     {
//     //       data: [
//     //         { x: 1, y: 1, r: 10 }
//     //       ],
//     //       label: 'UGL 1',
//     //     },
//     //     {
//     //       data: [
//     //         { x: 3, y: 5, r: 22 }
//     //       ],
//     //       label: 'UGL 2',
//     //     },
//     //   ]
//     // );
//     // console.log("DatosDispersionUgl", aux, this.Datos);

//     this.DatosDispersionUgl = aux.slice().sort(function (a, b) {
//       if (a.label > b.label) {
//         return 1;
//       }
//       if (a.label < b.label) {
//         return -1;
//       }
//       // a must be equal to b
//       return 0;
//     })
//     // console.log("this.DatosDispersionUgl",this.DatosDispersionUgl);

//   }

//   DatosRankingDeciloUgl = {}
//   CalculoRankingDeciloUgl(Decilo) {

//     let Label = []
//     let Data = []
//     if (this.Datos != undefined) {
//       for (let index = 0; index < this.Datos.length; index++) {
//         const element = this.Datos[index];
//         const key = element['UGL']

//         const count = this.Datos?.filter(a => a.UGL == key).length
//         const global = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr[Decilo], 0)

//         if (!(Label.filter(b => b == key).length > 0)) {
//           Label.push(key)
//           Data.push((global / count).toFixed(2))
//         }

//         // let aux = {}

//         let aux2 =[]

//         for (let index = 0; index < Label.length; index++) {
//           const element = Label[index];

//           // aux[element] = parseFloat( Data[index])

//           aux2.push({ugl:element,decilo:parseFloat(Data[index])})

//         }
//         Label = aux2.sort( (a,b) => a.decilo - b.decilo ).map( a=> a.ugl)
//         Data = aux2.sort( (a,b) => a.decilo - b.decilo ).map( a=> a.decilo)

// // console.log(aux2);

//         // if (!(aux.filter(b => b['Label'] == key).length > 0)) {
//         //   aux.push({
//         //     Label: key,
//         //     Data: {
//         //       data: [(global / count).toFixed(2)],
//         //       label: Decilo
//         //     }
//         //   })
//         // }

//       }

//       // for (let index = 0; index < this.Datos.length; index++) {
//       //   const element = this.Datos[index];
//       //   const key = element['UGL']

//       //   const count = this.Datos?.filter(a => a.UGL == key).length
//       //   const global = this.Datos?.filter(a => a.UGL == key).reduce((acc, curr) => acc + curr[Decilo], 0)

//       // }
//     }

//     // console.log("DatosDispersionUgl - formato",
//     //   [
//     //     {
//     //       data: [
//     //         { x: 1, y: 1, r: 10 }
//     //       ],
//     //       label: 'UGL 1',
//     //     },
//     //     {
//     //       data: [
//     //         { x: 3, y: 5, r: 22 }
//     //       ],
//     //       label: 'UGL 2',
//     //     },
//     //   ]
//     // );
//     // console.log("DatosDispersionUgl", aux, this.Datos);

//     // this.DatosRankingDeciloUgl[Decilo] = { Data, Label}

//     // console.log("this.DatosRankingDeciloUgl[" + Decilo + "]", this.DatosRankingDeciloUgl[Decilo]);
//     // this.dataGlobal = Data
//     // this.labelGlobal = Label

//     // this.DatosRankingDeciloUgl[Decilo]['Data'] = Data //[{data:this.data,label:this.filtro}]
//     this.DatosRankingDeciloUgl[Decilo]['Data'] = [{ data: Data, label: Decilo }]
//     this.DatosRankingDeciloUgl[Decilo]['Label'] = Label

//     // return {Label , Data}

//   }

//   CalculoRankingDeciloUglTotal(){
//     this.DatosRankingDeciloUglTotal = { Data: [], Label: [] }
//     this.DatosRankingDeciloUglTotal['Label'] = this.DatosRankingDeciloUgl["Decilo Global"]['Label']
//     this.DatosRankingDeciloUglTotal['Data'].push(
//       this.DatosRankingDeciloUgl["Decilo Global"]['Data'][0])
//     this.DatosRankingDeciloUglTotal['Data'].push(
//       this.DatosRankingDeciloUgl["Decilo Facturación"]['Data'][0])
//     this.DatosRankingDeciloUglTotal['Data'].push(
//       this.DatosRankingDeciloUgl["Decilo Asistencial"]['Data'][0])
//   }

//   limpiar(e) {
//     this.CalculoDispersionUgl()
//     this.DatosDispersionUgl1 = this.DatosDispersionUgl
//     this.CalculoRankingDeciloUgl("Decilo Global")
//     this.CalculoRankingDeciloUgl("Decilo Facturación")
//     this.CalculoRankingDeciloUgl("Decilo Asistencial")
//     this.CalculoRankingDeciloUglTotal()
//     // console.log("limpiar", e);
//   }

//   cambiaLado(e){
//     // console.log("EvalAsis",this.EvalAsis);
//     // console.log("EvalFact",this.EvalFact);
//     // console.log("EvalGlob",this.EvalGlob);
//     // console.log("CompAsis",this.CompAsis);
//     // console.log("CompFact",this.CompFact);
//     // console.log("CompGlob",this.CompGlob);
//     // console.log("e",e);

//     // this.DatosDispersionUgl = this.DatosDispersionUgl.filter(a => a.label == e)

//     let comparar = (a,comp,b)=>{

//       switch (comp) {
//         case "=":
//           return a == b
//           break;
//         case ">":
//           return a > b
//           break;
//         case "<":
//           return a < b
//           break;

//         default:
//           break;
//       }

//     }

//     this.DatosDispersionUgl1 =this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)).filter(a=>comparar (parseFloat(a.data[0].y),this.CompFact,this.EvalFact))

//     // console.log("this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)));

//     // console.log("222222222this.DatosDispersionUgl",this.DatosDispersionUgl.filter(a=>comparar (parseFloat(a.data[0].x),this.CompAsis,this.EvalAsis)).filter(a=>comparar (parseFloat(a.data[0].y),this.CompFact,this.EvalFact)));
//   }

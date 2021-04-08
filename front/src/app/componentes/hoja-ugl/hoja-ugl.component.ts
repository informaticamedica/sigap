import { Component, OnInit } from '@angular/core';
import { DatosDbService } from '../../servicios/datos-db.service'


@Component({
  selector: 'hoja-ugl',
  templateUrl: './hoja-ugl.component.html',
  styleUrls: ['./hoja-ugl.component.css']
})
export class HojaUglComponent implements OnInit {

  constructor(
    private datos: DatosDbService
  ) { }

  Datos
  Ugls
  // Prestadores


  ngOnInit(): void {

    this.datos.DatosApi().subscribe(
      res => {
        this.Datos = res
        this.Ugls = [... new Set(this.Datos.map(a => a.UGL))]
        this.Ugls.sort()
        // this.Prestadores = [... new Set(this.Datos.map(a => a.Prestador))]
        // console.log(this.Datos);
        // console.log(this.Ugls.sort());
        
      }
    )

  }

  ugl_seleccionada = ''
  addItem(e){
    this.ugl_seleccionada = e
    console.log("eeeee",e);
    
  }
  
  limpiar(e){
    this.ugl_seleccionada = "Todas"
    console.log("limpiar",e);
  }
}

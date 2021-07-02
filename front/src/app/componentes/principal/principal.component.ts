import { Component, OnInit } from '@angular/core';
import { DatosDbService } from 'src/app/servicios/datos-db.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  // ELEMENT_DATA = [
  //   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  //   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  //   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  // ];
  Datos;
  constructor(private datos: DatosDbService) {}

  ngOnInit(): void {
    this.datos.DatosApi('auditorias').subscribe((res: []) => {
      this.Datos = res.map((a) => {
        delete a['idauditoria'];
        return a;
      });
      console.log(res);
    });
  }
}

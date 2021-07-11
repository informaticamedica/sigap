import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatosDbService } from 'src/app/servicios/datos-db.service';
@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css'],
})
export class InformeComponent implements OnInit {
  constructor(
    private rutaActiva: ActivatedRoute,
    private datos: DatosDbService
  ) {}

  idauditoria = this.rutaActiva.snapshot.params.idauditoria;
  ngOnInit(): void {
    this.datos
      .DatosParametrosApi('informe', this.idauditoria)
      .subscribe((res) => console.log(res));
  }
}

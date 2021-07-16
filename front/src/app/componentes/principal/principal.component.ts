import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosDbService } from 'src/app/servicios/datos-db.service';
interface Auditorias {
  CUIT: string;
  Estado: string;
  'Fecha de Auditoría': string;
  Prestador: string;
  SAP: number;
  UGL: string;
  idauditoria: number;
}
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  Datos;
  Auditorias: [Auditorias];

  constructor(private datos: DatosDbService, private router: Router) {}

  ngOnInit(): void {
    this.datos.DatosApi('auditorias').subscribe((res: [Auditorias]) => {
      this.Auditorias = res;
      // console.log('this.Auditorias', this.Auditorias);
      this.Datos = res.map((a) => {
        const { idauditoria, ...datos } = a;
        return datos;
      });
      // console.log(res);
    });
  }

  auditoria($e) {
    console.log($e);
    console.log();

    const { idauditoria } = this.Auditorias.filter((a) => a.SAP === $e.SAP)[0];
    this.router.navigate(['/auditoria', idauditoria]);
  }
}

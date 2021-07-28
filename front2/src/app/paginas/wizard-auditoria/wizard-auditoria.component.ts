import { Component, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalCargandoService } from 'src/app/componentes/modal-cargando/modal-cargando.service';
import { Auditoria } from 'src/app/dto/auditoria.dto';
import { FlujoDeEstadosAuditoria } from 'src/app/dto/flujo-de-estados-auditoria.dto';
import { Informe } from 'src/app/dto/informe.dto';
import { Item } from 'src/app/dto/item.dto';
import { VerAuditoria } from 'src/app/dto/ver-auditoria.dto';
import { DatosDbService } from 'src/app/servicios/datos.service';
import * as Constantes from 'src/app/utils/constantes';

@Component({
  selector: 'wizard-auditoria',
  templateUrl: './wizard-auditoria.component.html',
  styleUrls: ['./wizard-auditoria.component.css'],
})
export class WizardAuditoriaComponent implements OnInit {
  Constantes = Constantes;

  pasoPlanificacionDeshabilitado: boolean = false;
  pasoGuiaDeshabilitado: boolean = false;
  pasoInformeDeshabilitado: boolean = false;
  pasoPrimeraRevisionDeshabilitado: boolean = false;
  pasoSegundaRevisionDeshabilitado: boolean = false;
  pasoGDEDeshabilitado: boolean = false;
  pasoSeleccionado: number = 0;


  idAuditoria!: string;
  auditoria!: Auditoria;
  informe!: Informe[];
  items!: Item[];

  flujoDeEstados!: FlujoDeEstadosAuditoria[];
  // @ViewChild('wizard') wizard!: MatStepper;
  constructor(private datosService: DatosDbService, private activatedRoute: ActivatedRoute,
    private modalCargandoService: ModalCargandoService) {
  }

  ngOnInit(): void {
    this.modalCargandoService.startLoading();
    this.datosService.DatosApi('auditorias/flujo-estados').subscribe(
      (data: FlujoDeEstadosAuditoria[]) => {
        this.flujoDeEstados = data;
        console.log(data)
      }
    );
    this.idAuditoria = this.activatedRoute.snapshot.params.idauditoria;
    if (this.idAuditoria) {
      //si llegó una auditoria por param es que entré a ver una ya creada
      this.datosService
        .DatosParametrosApi('auditoria', this.idAuditoria)
        .subscribe((res: VerAuditoria) => {
          this.auditoria = res.Auditoria;
          console.log(this.auditoria);
          this.setearPasoDelWizardSegunEstadoDeLaAuditoria(this.auditoria);
        });

    } else {
      // this.wizard.selectedIndex = this.INDEX_TAB_PLANIFICACION;
      this.modalCargandoService.stopLoading();
      //si no llegó ID estoy entrando a crear una auditoría
    }
  }

  setearPasoDelWizardSegunEstadoDeLaAuditoria(auditoria: Auditoria) {
    // this.wizard.linear = false;
    switch (auditoria.idestadoauditoria) {
      case Constantes.ESTADO_AUDITORIA_PLANIFICADA:
        this.pasoSeleccionado = Constantes.INDEX_TAB_PLANIFICACION;
        this.pasoPlanificacionDeshabilitado = false;
        this.pasoGuiaDeshabilitado = true;
        this.pasoInformeDeshabilitado = true;
        this.pasoPrimeraRevisionDeshabilitado = true;
        this.pasoSegundaRevisionDeshabilitado = true;
        this.pasoGDEDeshabilitado = true;
        break;
      case Constantes.ESTADO_AUDITORIA_PUBLICADA:
      case Constantes.ESTADO_GUIA_INICIDADA:
        this.pasoSeleccionado = Constantes.INDEX_TAB_GUIA;
        this.pasoPlanificacionDeshabilitado = false;
        this.pasoGuiaDeshabilitado = false;
        this.pasoInformeDeshabilitado = true;
        this.pasoPrimeraRevisionDeshabilitado = true;
        this.pasoSegundaRevisionDeshabilitado = true;
        this.pasoGDEDeshabilitado = true;
        break;
      case Constantes.ESTADO_GUIA_COMPLETADA:
      case Constantes.ESTADO_INFORME_INICIADO:
        this.pasoSeleccionado = Constantes.INDEX_TAB_INFORME;
        this.pasoPlanificacionDeshabilitado = false;
        this.pasoGuiaDeshabilitado = false;
        this.pasoInformeDeshabilitado = false;
        this.pasoPrimeraRevisionDeshabilitado = true;
        this.pasoSegundaRevisionDeshabilitado = true;
        this.pasoGDEDeshabilitado = true;
        break;
      case Constantes.ESTADO_INFORME_CONFORMADO:
        this.pasoSeleccionado = Constantes.INDEX_TAB_PRIMERA_REVISION;
        this.pasoPlanificacionDeshabilitado = false;
        this.pasoGuiaDeshabilitado = false;
        this.pasoInformeDeshabilitado = false;
        this.pasoPrimeraRevisionDeshabilitado = false;
        this.pasoSegundaRevisionDeshabilitado = true;
        this.pasoGDEDeshabilitado = true;
        break;
      case Constantes.ESTADO_PRIMERA_REVISION_APROBADA:
        this.pasoSeleccionado = Constantes.INDEX_TAB_SEGUNDA_REVISION;
        this.pasoPlanificacionDeshabilitado = false;
        this.pasoGuiaDeshabilitado = false;
        this.pasoInformeDeshabilitado = false;
        this.pasoPrimeraRevisionDeshabilitado = false;
        this.pasoSegundaRevisionDeshabilitado = false;
        this.pasoGDEDeshabilitado = true;
        break;
      case Constantes.ESTADO_SEGUNDA_REVISION_APROBADA:
      case Constantes.ESTADO_SEGUNDA_REVISION_OBSERVADA:
        this.pasoSeleccionado = Constantes.INDEX_TAB_GDE;
        this.pasoPlanificacionDeshabilitado = false;
        this.pasoGuiaDeshabilitado = false;
        this.pasoInformeDeshabilitado = false;
        this.pasoPrimeraRevisionDeshabilitado = false;
        this.pasoSegundaRevisionDeshabilitado = false;
        this.pasoGDEDeshabilitado = false;
        break;
      case Constantes.ESTADO_INFORME_SUBIDO_A_GDE:
        this.pasoPlanificacionDeshabilitado = false;
        this.pasoGuiaDeshabilitado = false;
        this.pasoInformeDeshabilitado = false;
        this.pasoPrimeraRevisionDeshabilitado = false;
        this.pasoSegundaRevisionDeshabilitado = false;
        this.pasoGDEDeshabilitado = false;
        this.pasoSeleccionado = Constantes.INDEX_TAB_GDE;
        break;
    }
    this.modalCargandoService.stopLoading();
  }

  obtenerColorDelBadge(pasoDelWizard: number): string {
    let color = "badge-secondary";
    if (this.auditoria) {
      switch (pasoDelWizard) {
        case Constantes.INDEX_TAB_PLANIFICACION:
          if (this.auditoria.idestadoauditoria !== Constantes.ESTADO_AUDITORIA_PLANIFICADA) {
            color = "badge-success";
          }
          break;
        case Constantes.INDEX_TAB_GUIA:
          break;
        case Constantes.INDEX_TAB_INFORME:
          break;
        case Constantes.INDEX_TAB_PRIMERA_REVISION:
          break;
        case Constantes.INDEX_TAB_SEGUNDA_REVISION:
          break;
        case Constantes.INDEX_TAB_GDE:
          break;
      }
    }
    return color;
  }
}

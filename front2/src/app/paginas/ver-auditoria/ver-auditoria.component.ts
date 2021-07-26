import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { DatosDbService } from 'src/app/servicios/datos.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
interface tipoEval {
  descripcion: string;
  idtipoeval: string;
  idvalor: string;
}
interface Item {
  Valor: string;
  componente: string;
  descripcion: string;
  descripcionTipoEval: string;
  iditem: string;
  idseccion: string;
  idtipoeval: string;
  tipoEval: tipoEval[];
}
interface Informe {
  Secciones: string;
  descripcion: string;
  idseccion: string;
  items: [];
  subSecciones?: Informe[];
}
interface Auditoria {
  CUIT: string;
  EstadoAuditoria: string;
  Prestador: string;
  ProvinciaPrestador: string;
  UGL: string;
  domicilio: string;
  email: string;
  fechainicio: string;
  idestadoauditoria: string;
  idguia: string;
  idprovincia: string;
  idugl: string;
  localidad: string;
  telefono: string;
  versionguia: string;
}

interface VerAuditoria {
  Auditoria: Auditoria[];
  Informe: Informe[];
  items: Item[];
}
@Component({
  selector: 'ver-auditoria',
  templateUrl: './ver-auditoria.component.html',
  styleUrls: ['./ver-auditoria.component.css'],
})
export class VerAuditoriaComponent implements OnInit {
  idauditoria = this.rutaActiva.snapshot.params.idauditoria;
  Auditoria: any;
  Informe: any;
  items: any;
  Guardando = false;
  form: FormGroup = this.fb.group({
    items: this.fb.array([]),
  });
  completarGuia = false;
  CompletarGuia(arg: boolean) {
    if (arg) this.form.enable();
    else this.form.disable();
    this.completarGuia = arg;
  }

  constructor(
    private rutaActiva: ActivatedRoute,
    private datos: DatosDbService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.datos
      .DatosParametrosApi('auditoria', this.idauditoria)
      .subscribe((res: VerAuditoria) => {
        console.log(res);
        const { Auditoria, Informe, items } = res;
        this.Auditoria = Auditoria;
        this.Informe = Informe;
        this.items = items;
        this.agregarItems(items);
        this.form.disable();
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

  private configSuccess: MatSnackBarConfig = {
    panelClass: ['style-success'],
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['style-error'],
  };

  public snackbarSuccess(message: string) {
    this._snackBar.open(message, 'Aceptar', this.configSuccess);
  }

  public snackbarError(message: string) {
    this._snackBar.open(message, 'Aceptar', this.configError);
  }

  ELPROBLEMA(asd: any) {
    return this.form.value.items.findIndex(
      (x: { iditem: any }) => x.iditem === asd
    );
    // console.log('qwe', qwe);
  }
  get getSubelementos() {
    return this.form.get('items') as FormArray;
    // return this.form.controls['items'] as FormArray;
  }

  onSave() {
    console.log('Form', this.form.value);
    console.log(
      'completos',
      this.form.value.items.filter((a: { Valor: string }) => a.Valor != '')
    );
    this.Guardando = true;
    this.datos
      .guardarDatosParametrosApi('auditoria', this.idauditoria, this.form.value)
      .subscribe((res) => {
        console.log('guardarDatosParametrosApi', res);
        this.Guardando = false;
        this.CompletarGuia(false);
        this.openSnackBar('Cambios guardados', 'Aceptar');
      });

    // console.log('Form');
  }
  onFileInput(e: any) {}

  agregarItems(items: Item[]) {
    items.forEach(({ Valor, iditem, descripcion }) => {
      const ItemControl = this.fb.group({ Valor, iditem, descripcion });
      this.getSubelementos.push(ItemControl);
    });
  }

  agregarItemsInforme(Informe: any[]) {
    const items = Informe.map((inf) => {
      return '';
    });
  }
}

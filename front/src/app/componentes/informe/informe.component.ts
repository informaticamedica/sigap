import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { DatosDbService } from 'src/app/servicios/datos-db.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
interface Item {
  item: { iditem: string; valor: string };
}
@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css'],
})
export class InformeComponent implements OnInit {
  constructor(
    private rutaActiva: ActivatedRoute,
    private datos: DatosDbService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  idauditoria = this.rutaActiva.snapshot.params.idauditoria;
  Auditoria;
  Informe;
  items;
  Guardando = false;
  form: FormGroup;
  ngOnInit(): void {
    this.datos
      .DatosParametrosApi('auditoria', this.idauditoria)
      .subscribe((res: { Auditoria; Informe; items }) => {
        console.log(res);
        const { Auditoria, Informe, items } = res;
        this.Auditoria = Auditoria;
        this.Informe = Informe;
        this.items = items;
        this.agregarItems(items);
      });

    this.iniForm();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      duration: 4000
  });
  }

  private configSuccess: MatSnackBarConfig = {
    panelClass: ['style-success'],    
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['style-error'],
  };

  public snackbarSuccess(message) {
    this._snackBar.open(message, 'Aceptar', this.configSuccess);
  }

  public snackbarError(message) {
    this._snackBar.open(message, 'Aceptar', this.configError);
  }

  ELPROBLEMA(asd) {
    return this.form.value.items.findIndex((x) => x.iditem === asd);
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
      this.form.value.items.filter((a) => a.Valor != '')
    );
    this.Guardando = true;
    this.datos
      .guardarDatosParametrosApi('auditoria', this.idauditoria, this.form.value)
      .subscribe((res) => {
        console.log('guardarDatosParametrosApi', res);
        this.Guardando = false;
        this.openSnackBar("Cambios guardados","Aceptar")
      });

    // console.log('Form');
  }
  onFileInput(e) {}

  agregarItems(items) {
    items.forEach(({ Valor, iditem, descripcion }) => {
      const ItemControl = this.fb.group({ Valor, iditem, descripcion });
      this.getSubelementos.push(ItemControl);
    });
    // const control = <FormArray>this.form.controls['items'];
    // const iniSubelementos = {
    //   idauditoria: '',
    //   iditem: '',
    //   valor: '',
    // };
    // console.log(control);
    // control.removeAt(0);

    // items.forEach((item) =>
    //   control.push(
    //     this.fb.group({
    //       iditem: item.iditem,
    //       valor: item.Valor,
    //     })
    //   )
    // );
  }

  agregarItemsInforme(Informe) {
    const items = Informe.map((inf) => {
      return '';
    });
  }

  iniForm() {
    this.form = this.fb.group({
      items: this.fb.array([
        // this.fb.group({
        //   iditem: ['', []],
        //   valor: ['', []],
        // }),
      ]),
    });
  }
}

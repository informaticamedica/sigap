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
    private fb: FormBuilder
  ) {}

  idauditoria = this.rutaActiva.snapshot.params.idauditoria;
  Auditoria;
  Informe;
  items;
  Guardando = false;
  form: FormGroup;
  ngOnInit(): void {
    this.datos
      .DatosParametrosApi('informe', this.idauditoria)
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
      .guardarDatosParametrosApi('informe', this.idauditoria, this.form.value)
      .subscribe((res) => {
        console.log('guardarDatosParametrosApi', res);
        this.Guardando = false;
      });

    // console.log('Form');
  }

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

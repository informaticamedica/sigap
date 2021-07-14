import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private datos: DatosDbService,
    private fb: FormBuilder
  ) {}

  idauditoria = this.rutaActiva.snapshot.params.idauditoria;
  Auditoria;
  Informe;
  form: FormGroup;
  ngOnInit(): void {
    this.datos
      .DatosParametrosApi('informe', this.idauditoria)
      .subscribe((res: { Auditoria; Informe; items }) => {
        console.log(res);
        const { Auditoria, Informe, items } = res;
        this.Auditoria = Auditoria;
        this.Informe = Informe;
        this.agregarItems(items);
      });

    this.iniForm();
  }

  get getSubelementos() {
    return this.form.get('items') as FormArray;
  }

  onSave() {
    console.log('Form', this.form.value);
    console.log(
      'completos',
      this.form.value.items.filter((a) => a.valor != '')
    );

    this.datos
      .guardarDatosParametrosApi('informe', this.idauditoria, this.form.value)
      .subscribe((res) => console.log('guardarDatosParametrosApi', res));

    // console.log('Form');
  }

  agregarItems(items) {
    const control = <FormArray>this.form.controls['items'];
    const iniSubelementos = {
      idauditoria: '',
      iditem: '',
      valor: '',
    };
    console.log(control);
    control.removeAt(0);

    items.forEach((item) =>
      control.push(
        this.fb.group({
          idauditoria: this.idauditoria,
          iditem: item.iditem,
          valor: item.Valor,
        })
      )
    );
  }

  iniForm() {
    this.form = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          idauditoria: ['', [Validators.required]],
          iditem: ['', [Validators.required]],
          valor: ['', []],
        }),
      ]),
    });
  }
}

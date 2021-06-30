import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'nueva-auditoria',
  templateUrl: './nueva-auditoria.component.html',
  styleUrls: ['./nueva-auditoria.component.css'],
})
export class NuevaAuditoriaComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  formGroup = this.fb.group({
    prestador: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    tipoInforme: ['', [Validators.required]],
    referenteEquipo: ['', [Validators.required]],
    integrantes: this.fb.group({
      area: [''],
      usuario: [''],
      referente: [''],
    }),
  });
  ngOnInit(): void {
    console.log(this.formGroup);
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
  onCancel() {
    console.log(this.formGroup);
  }
}

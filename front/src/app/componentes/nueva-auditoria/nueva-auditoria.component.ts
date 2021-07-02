import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'nueva-auditoria',
  templateUrl: './nueva-auditoria.component.html',
  styleUrls: ['./nueva-auditoria.component.css'],
})
export class NuevaAuditoriaComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  form: FormGroup;
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
    this.form = this.formBuilder.group({
      plantillasInformes: [
        this.baseEditar ? this.baseEditar.plantillasInformes._id : '',
        [Validators.required],
      ],
      modalidad: ['', []],
      prestadores: [
        this.baseEditar ? this.baseEditar.prestadores._id : '',
        [Validators.required],
      ],
      fechaReal: ['', [Validators.required]],
      usuarios: [
        this.baseEditar ? this.baseEditar.usuarios._id : '',
        [Validators.required],
      ],
      // usuarios: [this.baseEditar ? this.baseEditar.usuarios._id : '', []],
      estado: [this.baseEditar ? this.baseEditar.estado : '', []],
      GDE: [this.baseEditar ? this.baseEditar.GDE : '', []],
      UGL: [this.baseEditar ? this.baseEditar.UGL : '', []],
      N_SAP: [
        this.baseEditar
          ? this.baseEditar.hasOwnProperty('N_SAP')
            ? this.baseEditar?.N_SAP
            : ''
          : '',
        [],
      ],
      N_CUIT_CUIL: [
        this.baseEditar
          ? this.baseEditar.hasOwnProperty('N_CUIT_CUIL')
            ? this.baseEditar.N_SAP
            : ''
          : '',
        [],
      ],
      // N_CUIT_CUIL: [this.baseEditar ? this.baseEditar.N_CUIT_CUIL : '', []],
      cumplimiento: [this.baseEditar ? this.baseEditar.cumplimiento : '', []],
      // integrantes: this.formBuilder.group(
      //   {
      //     tabla: this.formBuilder.array([])
      //   }
      // ),

      integrantes: this.baseEditar
        ? this.formBuilder.array(
            this.baseEditar.integrantes.map((a) =>
              this.formBuilder.group({
                // secciones: [{_id: a.secciones._id, mostrar: a.secciones.mostrar}, ''],
                secciones: [a.secciones._id, ''],
                usuarios: [a.usuarios._id, ''],
                responsable: [a.responsable, ''],
              })
            )
          )
        : this.formBuilder.array([
            this.formBuilder.group({
              secciones: ['', [Validators.required]],
              usuarios: ['', [Validators.required]],
              // legajo: ['', []],
              // profesion: ['', []],
              responsable: [false, []],
            }),
          ]),
      // name: ['',  [Validators.required]],
      // date: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.email]],
      // text: ['', [Validators.required, Validators.maxLength(200)]],
      // category: ['', [Validators.required]],
      // gender: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
  onCancel() {
    console.log(this.formGroup);
    this.router.navigate(['/', 'principal']);
  }

  save() {}
  guardarUGL(state) {}
  Prestadores;
  displayFn() {}
  PlantillasInformes;
  AuxUsuarios1;
  guardarUGL2(usuario) {}
  displayFn3() {}
  addSubElemento() {}
  getSubelementos = { controls: [] };
  deleteSubElemento(pointIndex) {}
  Area;
  displayFn2;
  AuxUsuarios;
  baseEditar;
}

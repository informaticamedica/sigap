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
import { DatosDbService } from 'src/app/servicios/datos-db.service';

@Component({
  selector: 'nueva-auditoria',
  templateUrl: './nueva-auditoria.component.html',
  styleUrls: ['./nueva-auditoria.component.css'],
})
export class NuevaAuditoriaComponent implements OnInit {
  PrestadoresRes;
  constructor(
    private datos: DatosDbService,
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
  baseEditar;
  ngOnInit(): void {
    this.datos
      .DatosApi('planificarauditoria')
      .subscribe((res: { Prestadores: [] }) => {
        console.log('res', res);
        this.PrestadoresRes = res.Prestadores.map((a) => {
          // delete a['idprestador'];
          return a;
        });
        this.Prestadores = res.Prestadores.map((a) => {
          // delete a['idprestador'];
          return a;
        });
        this.iniForm();
      });

    this.iniForm();
    console.log('this.form', this.form);
  }

  displayFn(state) {
    let aux = this.Prestadores.filter((a) => a.idprestador == state)[0];
    return aux ? aux.descripcion : undefined;
  }

  iniForm() {
    this.form = this.formBuilder.group({
      plantillasInformes: [
        '',
        // this.baseEditar ? this.baseEditar.plantillasInformes._id : '',
        [Validators.required],
      ],
      modalidad: ['', []],
      prestadores: [
        '',
        // this.baseEditar ? this.baseEditar.prestadores.idprestador : '',
        [Validators.required],
      ],
      fechaReal: ['', [Validators.required]],
      usuarios: [
        '',
        // this.baseEditar ? this.baseEditar.usuarios._id : '',
        [Validators.required],
      ],
      estado: ['', []],
      GDE: ['', []],
      UGL: ['', []],
      N_SAP: ['', []],
      N_CUIT_CUIL: ['', []],
      cumplimiento: ['', []],

      integrantes: this.baseEditar
        ? this.formBuilder.array(
            this.baseEditar.integrantes.map((a) =>
              this.formBuilder.group({
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
              responsable: [false, []],
            }),
          ]),
    });

    this.form.get('prestadores').valueChanges.subscribe((value) => {
      console.log('value', value);
      this.Prestadores = this.PrestadoresRes.filter(
        (a) =>
          a.descripcion.includes(value) ||
          a.SAP.toString().includes(value) ||
          a.CUIT.includes(value)
      );
      // log
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
  Prestadores = [];

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
}

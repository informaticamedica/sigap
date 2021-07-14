import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  HostListener,
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
  form: FormGroup;
  PrestadoresRes;
  Prestadores = [];
  TipoInforme;
  Usuarios = [];
  maxLenghtPrest: number;
  maxLenghtUsuar: number;
  UsuariosRes: any;
  AreasRes;
  Area;
  AuxUsuarios = [];

  constructor(
    private datos: DatosDbService,
    private fb: FormBuilder,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  isMobileLayout = false;
  // @HostListener('window:resize', [])
  // onResize() {
  //   var width = window.innerWidth;
  //   this.isMobileLayout = width < 500;
  // }
  maxNumberArray = (array: number[]) =>
    array.reduce((accumulator, currentValue) => {
      return accumulator > currentValue ? accumulator : currentValue;
    });
  ngOnInit(): void {
    // window.onresize = () => (this.isMobileLayout = window.innerWidth <= 500);
    this.datos
      .DatosApi('planificarauditoria')
      .subscribe(
        (res: {
          Prestadores: [];
          TipoInforme: [];
          Usuarios: [];
          Areas: [];
        }) => {
          console.log('res', res);
          this.PrestadoresRes = res.Prestadores.map((a) => {
            // delete a['idprestador'];
            return a;
          });
          this.Prestadores = res.Prestadores.map((a) => {
            // delete a['idprestador'];
            return a;
          });
          const LenghtDescripPrestadores = res.Prestadores.map(
            (a: { Prestador: string }) => a['Prestador'].length
          );
          this.maxLenghtPrest = this.maxNumberArray(LenghtDescripPrestadores);

          this.TipoInforme = res.TipoInforme;
          this.Usuarios = res.Usuarios;
          this.UsuariosRes = res.Usuarios;
          this.AuxUsuarios.push(res.Usuarios);
          const LenghtDescripUsuarios = res.Usuarios.map(
            (a: { Prestador: string }) =>
              (a['apellido'] + ' , ' + a['nombre']).length
          );
          this.maxLenghtUsuar = this.maxNumberArray(LenghtDescripUsuarios);
          this.iniForm();
          this.AreasRes = res.Areas;
        }
      );

    this.iniForm();
    // console.log('this.form', this.form);
  }

  displayFn(state) {
    const aux = this.Prestadores.filter((a) => a.idprestador == state)[0];
    return aux ? aux.Prestador : undefined;
  }
  displayFn3(state) {
    const aux = this.Usuarios.filter((a) => a.idusuario == state)[0];
    return aux ? aux.apellido + ' , ' + aux.nombre : undefined;
  }
  displayFn2(state) {
    const aux = this.Usuarios.filter((a) => a.idusuario == state)[0];
    return aux ? aux.apellido + ' , ' + aux.nombre : undefined;
  }

  iniForm() {
    this.form = this.formBuilder.group({
      prestadores: ['', [Validators.required]],
      fechaReal: ['', []],
      TipoInforme: ['', [Validators.required]],
      // modalidad: ['', []],
      referente: ['', []],
      UGL: ['', []],
      N_SAP: ['', []],
      N_CUIT_CUIL: ['', []],
      cumplimiento: ['', []],

      integrantes: this.formBuilder.array([
        this.formBuilder.group({
          areas: ['', [Validators.required]],
          usuarios: ['', [Validators.required]],
          responsable: [false, []],
        }),
      ]),
    });

    this.form.get('prestadores').valueChanges.subscribe((value) => {
      // console.log('value', value);
      value = value.toLocaleLowerCase();
      this.Prestadores = this.PrestadoresRes.filter(
        (a) =>
          a.Prestador.toLocaleLowerCase().includes(value) ||
          a.SAP.toString().toLocaleLowerCase().includes(value) ||
          a.CUIT.toLocaleLowerCase().includes(value)
      );
    });
    this.form.get('TipoInforme').valueChanges.subscribe((value) => {
      // console.log('value', value);
      // value = value.toLocaleLowerCase();
      const tipoInforme = this.TipoInforme.filter((a) => a.idguia == value)[0];
      this.Area = this.AreasRes.filter(
        (a) =>
          a.idguia == tipoInforme.idguia &&
          a.versionguia == tipoInforme.versionactual
      );
      // console.log(tipoInforme);
    });
    this.form.get('referente').valueChanges.subscribe((value: string) => {
      // console.log(' this.UsuariosRes', this.UsuariosRes);
      value = value.toLocaleLowerCase();
      this.Usuarios = this.UsuariosRes.filter(
        (a) =>
          a.apellido?.toLocaleLowerCase().includes(value) ||
          a.nombre?.toLocaleLowerCase().includes(value) ||
          a.legajo?.toLocaleLowerCase().includes(value) ||
          a.Profesion?.toLocaleLowerCase().includes(value)
      );
    });
  }

  onSubmit() {
    console.log(this.form.value);
    this.datos
      .guardarDatosApi('planificarauditoria', {
        ...this.form.value,
        VERSIONGUIA: this.TipoInforme[0].versionactual,
      })
      .subscribe((res) => {
        this.router.navigate(['/', 'principal']);
        console.log(res);
      });
  }
  onCancel() {
    // console.log(this.formGroup);
    this.router.navigate(['/', 'principal']);
  }

  Subelementos = '';
  get getSubelementos() {
    return this.form.get('integrantes') as FormArray;
  }

  Typeof(a) {
    return typeof a;
  }
  deleteSubElemento(index) {
    const control = <FormArray>this.form.controls['integrantes'];
    if (control != undefined) control.removeAt(index);
  }
  length(o) {
    return o.length;
  }
  addSubElemento() {
    const control = <FormArray>this.form.controls['integrantes'];
    const iniSubelementos = {
      areas: '',
      usuarios: '',
      responsable: false,
    };
    control.push(this.formBuilder.group(iniSubelementos));
    this.AuxUsuarios.push(this.UsuariosRes);
  }
}

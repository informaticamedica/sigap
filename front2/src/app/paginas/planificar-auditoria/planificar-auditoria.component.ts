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
import { DatosDbService } from 'src/app/servicios/datos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
interface Usuarios {
  idusuario: string;
  apellido: string;
  nombre: string;
  Profesion: string;
  legajo: string;
}
interface Prestadores {
  Prestador: string;
  idprestador: string;
  SAP: string;
  CUIT: string;
  UGL: string;
}
interface TipoInforme {
  idguia: string;
  versionactual: string;
  idareaauditoria: string;
  descripcion: string;
}
interface Areas {
  idguia: string;
  versionguia: string;
  idareaauditoria: string;
  descripcion: string;
}
interface planificarauditoria {
  Prestadores: [Prestadores];
  TipoInforme: [TipoInforme];
  Usuarios: [Usuarios];
  Areas: [Areas];
}
@Component({
  selector: 'planificar-auditoria',
  templateUrl: './planificar-auditoria.component.html',
  styleUrls: ['./planificar-auditoria.component.css'],
})
export class PlanificarAuditoriaComponent implements OnInit {
  form = this.formBuilder.group({
    prestadores: ['', [Validators.required]],
    fechainicio: ['', []],
    fechafin: ['', []],
    TipoInforme: ['', [Validators.required]],
    observaciones: ['', []],
    integrantes: this.formBuilder.array([
      this.formBuilder.group({
        areas: ['', []],
        usuarios: ['', []],
      }),
    ]),
  });
  PrestadoresRes: Prestadores[] = [];
  Prestadores: Prestadores[] = [];
  TipoInforme: TipoInforme[] = [];
  maxLenghtPrest = 0;
  maxLenghtUsuar = 0;
  Usuarios: Usuarios[] = [];
  UsuariosRes: Usuarios[] = [];
  AuxUsuarios: Usuarios[][] = [];
  AreasRes: Areas[] = [];
  Area: Areas[] = [];

  Guardando = false;
  constructor(
    private datos: DatosDbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  isMobileLayout = false;
  maxNumberArray = (array: number[]) =>
    array.reduce((accumulator, currentValue) => {
      return accumulator > currentValue ? accumulator : currentValue;
    });
  ngOnInit(): void {
    this.datos
      .DatosApi('planificarauditoria')
      .subscribe((res: planificarauditoria) => {
        console.log('res', res);
        this.PrestadoresRes = res.Prestadores.map((a) => {
          // delete a['idprestador'];
          return a;
        });
        this.Prestadores = res.Prestadores.map((a) => {
          // delete a['idprestador'];
          return a;
        });

        // console.log('this.Prestadores', this.Prestadores);
        // console.log('this.PrestadoresRes', this.PrestadoresRes);

        const LenghtDescripPrestadores = res.Prestadores.map(
          (a: { Prestador: string }) => a['Prestador'].length
        );
        this.maxLenghtPrest = this.maxNumberArray(LenghtDescripPrestadores);

        this.TipoInforme = res.TipoInforme;
        this.Usuarios = res.Usuarios;
        this.UsuariosRes = res.Usuarios;
        this.AuxUsuarios.push(res.Usuarios);
        console.log('this.AuxUsuarios', this.AuxUsuarios);

        const LenghtDescripUsuarios = res.Usuarios.map(
          (a) => (a['apellido'] + ' , ' + a['nombre']).length
        );
        this.maxLenghtUsuar = this.maxNumberArray(LenghtDescripUsuarios);
        this.iniForm();
        this.AreasRes = res.Areas;
      });

    this.iniForm();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

  displayFn(state: any) {
    // console.log('displayFn');
    // console.log(state);
    // console.log('this.PrestadoresRes', this.PrestadoresRes);
    // console.log('this.Usuarios', this.Usuarios);
    // console.log(this.PrestadoresRes?.find((a) => a.idprestador == state));

    const aux = this.PrestadoresRes?.find((a) => a.idprestador == state);
    return aux ? aux.Prestador : '';
  }
  displayFn3(state: any) {
    const aux = this.Usuarios?.filter((a) => a.idusuario == state)[0];
    return aux ? aux.apellido + ' , ' + aux.nombre : '';
  }
  displayFn2(state: any) {
    const aux = this.UsuariosRes?.filter(
      (a: { idusuario: any }) => a.idusuario == state
    )[0];
    console.log('state', state);
    console.log('aux', aux);
    console.log('this.Usuarios', this.Usuarios);

    return aux ? aux.apellido + ' , ' + aux.nombre : '';
  }

  iniForm() {
    // this.form = this.formBuilder.group({
    //   prestadores: ['', [Validators.required]],
    //   fechainicio: ['', []],
    //   fechafin: ['', []],
    //   TipoInforme: ['', [Validators.required]],
    //   observaciones: ['', []],
    //   integrantes: this.formBuilder.array([
    //     this.formBuilder.group({
    //       areas: ['', []],
    //       usuarios: ['', []],
    //     }),
    //   ]),
    // });

    this.form.get('prestadores')!.valueChanges.subscribe((value) => {
      // console.log('value', value);
      value = value.toLocaleLowerCase();
      this.Prestadores = this.PrestadoresRes.filter(
        (a) =>
          a.Prestador.toLocaleLowerCase().includes(value) ||
          a.SAP.toString().toLocaleLowerCase().includes(value) ||
          a.CUIT.toLocaleLowerCase().includes(value)
      );
    });
    this.form.get('TipoInforme')!.valueChanges.subscribe((value) => {
      // console.log('value', value);
      // value = value.toLocaleLowerCase();
      const tipoInforme = this.TipoInforme.filter((a) => a.idguia == value)[0];
      console.log('tipoInforme', tipoInforme);

      this.Area = this.AreasRes.filter(
        (a) =>
          a.idguia == tipoInforme.idguia &&
          a.versionguia == tipoInforme.versionactual
      );
      console.log('this.AreasRes', this.AreasRes);
      console.log('this.Area', this.Area);
    });

    this.form.get('integrantes')!.valueChanges.subscribe((input) => {
      console.log('input', input);
      this.AuxUsuarios.forEach(
        (value: Usuarios[], index: number, array: Usuarios[][]) => {
          array[index] = this.UsuariosRes.filter((u) => {
            const nombre = u.apellido + ' , ' + u.nombre;
            const legajo = u.legajo + '';
            const profesion = u.Profesion + '';
            return (
              nombre
                .toLocaleLowerCase()
                .includes(input[index].usuarios.toLocaleLowerCase()) ||
              legajo.includes(input[index].usuarios) ||
              profesion
                .toLocaleLowerCase()
                .includes(input[index].usuarios.toLocaleLowerCase())
            );
          });
        }
      );
    });
    // this.form.get('referente').valueChanges.subscribe((value: string) => {
    //   // console.log(' this.UsuariosRes', this.UsuariosRes);
    //   value = value.toLocaleLowerCase();
    //   this.Usuarios = this.UsuariosRes.filter(
    //     (a) =>
    //       a.apellido?.toLocaleLowerCase().includes(value) ||
    //       a.nombre?.toLocaleLowerCase().includes(value) ||
    //       a.legajo?.toLocaleLowerCase().includes(value) ||
    //       a.Profesion?.toLocaleLowerCase().includes(value)
    //   );
    // });
  }
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  onSave() {
    console.log(this.form.value);
    this.Guardando = true;
    this.datos
      .guardarDatosApi('planificarauditoria', {
        ...this.form.value,
        VERSIONGUIA: this.TipoInforme[0].versionactual,
      })
      .subscribe((res) => {
        this.router.navigate(['/', 'principal']);
        this.openSnackBar('Cambios guardados', 'Aceptar');
        console.log(res);
        this.Guardando = false;
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

  Typeof(a: any) {
    return typeof a;
  }
  deleteSubElemento(index: number) {
    const control = <FormArray>this.form.controls['integrantes'];
    if (control != undefined) control.removeAt(index);
  }
  length(o: string | any[]) {
    return o.length;
  }
  addSubElemento() {
    const control = <FormArray>this.form.controls['integrantes'];
    const iniSubelementos = {
      areas: '',
      usuarios: '',
    };
    control.push(this.formBuilder.group(iniSubelementos));
    this.AuxUsuarios.push(this.UsuariosRes);
  }
}

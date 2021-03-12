import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AutService } from "../../servicios/aut.service";

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit {


  form = this.fb.group({
    Username: ['', Validators.required],
    Password: ['', Validators.required],
    rePassword: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private aut: AutService,
    private router: Router,
  ) {



  }

  ngOnInit(): void {
    if (this.aut.loggedIn()) {
      this.router.navigate(['/principal']);
    }
  }

  cambiar_contrasenia() {

    if (this.form.value.Password != this.form.value.rePassword) {
      alert(
        `
    Las contraseñas ingresadas no coinciden.
    `
      )
    }
    else if (this.form.dirty && this.form.valid) {
      alert(
        `
        Se envio el cambio al sistema y se deshabilito
        al usuario ${this.form.value.Username}, para poder acceder nuevamente debe 
        comunicarse con el administrador del sistema
        `
      );

      this.aut.cambiar_contrasenia({
        user: this.form.value.Username,
        pass: this.form.value.Password,
      }).subscribe((a) => {
        console.log('===============Respuesta API=====================');
        console.log(a);
        console.log('===============Fin respuesta=====================');
        this.router.navigate(['/principal']);
      })


    }
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AutService } from "../../servicios/aut.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form = this.fb.group({
    Username: ['', Validators.required],
    Password: ['', Validators.required],
    rePassword: ['', Validators.required],
    Nombre: ['', Validators.required],
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

  registrarse() {

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
        user: ${this.form.value.Username} 
        pass: ${this.form.value.Password}
        nombre: ${this.form.value.Nombre}
        `
      );

      this.aut.registrar({
        user: this.form.value.Username,
        pass: this.form.value.Password,
        nombre: this.form.value.Nombre,
      }).subscribe((a) => {
        console.log('===============Respuesta API=====================');
        console.log(a);
        console.log('===============Fin respuesta=====================');
        this.router.navigate(['/principal']);
      })


    }
  }

}

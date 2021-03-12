import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AutService } from "../../servicios/aut.service";
import { Router } from '@angular/router'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  form = this.fb.group({
    Username: ['', Validators.required],
    Password: ['', Validators.required],
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

  ingresar() {
    if (this.form.dirty && this.form.valid) {
      // alert(
      //   `user: ${this.form.value.Username} 
      //   pas: ${this.form.value.Password}`
      // );


      this.aut.autenticar({
        user: this.form.value.Username,
        pass: this.form.value.Password
      }).subscribe((res) => {
        localStorage.clear()
        localStorage.setItem('token', res['token']);
        localStorage.setItem('nombre', res['nombre']);
        // console.log('====================================');
        // console.log(res);
        // console.log('====================================');
        this.router.navigate(['/principal']);
      }, error => {
        alert(error.error.error )
      })


    }
  }

}

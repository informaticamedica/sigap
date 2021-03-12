import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class AutService {


  private urlApi = "http://localhost:4000/api/"

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  autenticar(datos){
    return this.http.post(this.urlApi + "signin",datos)
  }

  registrar(datos){
    return this.http.post(this.urlApi + "signup",datos)
  }
  cambiar_contrasenia(datos){
    return this.http.put(this.urlApi + "signup",datos)
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    // localStorage.removeItem('usuar');
    // localStorage.removeItem('token');
    localStorage.clear()
    this.router.navigate(['/signin']);
  }

  nombre(){
    return localStorage.getItem('nombre')
  }

}

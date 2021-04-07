import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosDbService {
  // private urlApi = "http://192.168.0.150:4000/api/datos/"
  private urlApi = "http://localhost:4000/api/datos/"
  constructor(
    private http: HttpClient
  ) { }

  DatosApi(){
    return this.http.get(this.urlApi )
  }

}

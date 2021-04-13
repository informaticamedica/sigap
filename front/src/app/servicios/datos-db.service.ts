import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosDbService {
  // private urlApi = "http://192.168.0.150:4000/api/datos/"
  // private urlApi = "http://localhost:4000/api/datos/"
  private urlApi = "http://10.0.74.204:4000/api/datos/"
  constructor(
    private http: HttpClient
  ) { }

  header = new HttpHeaders().set(
    "Authorization",
    "Bearer "+ localStorage.getItem("token")
  );

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json' ,
      'Authorization': 'Bearer '+ localStorage.getItem("token"),
      'Accept' : 'application/json'
    })
  };

  DatosApi(){
    // console.log(localStorage.getItem('token'),this.http.);
    
    return this.http.get(this.urlApi, this.httpOptions )

  }

}

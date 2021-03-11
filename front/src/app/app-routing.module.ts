import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from "./componentes/signin/signin.component"
import { SignupComponent } from "./componentes/signup/signup.component"
import { PrincipalComponent } from "./componentes/principal/principal.component"

import { AuthGuard } from './servicios/auth.guard';

const routes: Routes = [
  { path: "", component: SigninComponent },
  { path: "signin", component: SigninComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "principal", 
    component: PrincipalComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

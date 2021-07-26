import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './componentes/signin/signin.component';
import { SignupComponent } from './componentes/signup/signup.component';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { PlanificarAuditoriaComponent } from './paginas/planificar-auditoria/planificar-auditoria.component';
import { VerAuditoriaComponent } from './paginas/ver-auditoria/ver-auditoria.component';
import { AuthGuard } from './servicios/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'planificarauditoria',
    component: PlanificarAuditoriaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auditoria/:idauditoria',
    component: VerAuditoriaComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

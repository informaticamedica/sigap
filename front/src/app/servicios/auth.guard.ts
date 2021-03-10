import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutService } from './aut.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AutService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (this.authService.loggedIn()) {

      

      return true;
    }

    this.router.navigate(['/signin']);
    return false;
  }

  NOcanActivate(): boolean {
    if (this.authService.loggedIn()) {
      return false;
    }

    this.router.navigate(['/signin']);
    return true;
  }

}

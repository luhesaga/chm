import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
    )
  {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    return this.auth.user$.pipe(
      take(1),
      map(user => {console.log(user)
         return user != null}),
      tap(canEdit => {
        console.log(canEdit)
        if(!canEdit)
        {
          this.router.navigateByUrl('login')
        }
      }));
  }
}

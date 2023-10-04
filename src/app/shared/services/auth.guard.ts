import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { AppRoutes } from '../routes/app.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authorized: boolean = false;

  constructor(
    public router: Router,
    private authorize: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      resolve(await this.handleAuthorization(this.authorize.isAuthenticated() as boolean, state));
    });
  }

  private async handleAuthorization(isAuthenticated: boolean, state: RouterStateSnapshot) {
    if (!isAuthenticated) {
      this.router.navigate(['/' + AppRoutes.Auth + '/' + AppRoutes.Login], {
        queryParams: {
          ['returnUrl']: state.url,
        },
      });
    }
    return isAuthenticated;
  }
}

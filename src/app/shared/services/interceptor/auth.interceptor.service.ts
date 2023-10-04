import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../token.service';
import { CommonService } from '../common.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private commonService: CommonService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let hideLoader = req.params.get('hideLoader');
    if (hideLoader == 'true') {
      this.commonService.hide();
      //  Loader subject should false
    } else {
      this.commonService.show();
      // Loader subject should true
    }

    const accessToken = this.tokenStorageService.getAccessToken();

    if (accessToken) {
      req = this.addTokenToRequest(req, accessToken);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Token expired, try to refresh
          return this.handleTokenExpiration(req, next);
        } else {
          return throwError(error);
        }
      }),
      finalize(() => {
        this.commonService.hide();
        // Finalize code here
      }),
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    let isTokenSkip = request.params.get('X-Skip-Token');

    if (isTokenSkip == 'true') {
      const params = request.params.delete('X-Skip-Token');
      request = request.clone({ params });
    }
    if (request.url.includes(environment.apiURL)) {
      if (!!token) {
        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
    return request;
  }

  private handleTokenExpiration(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.refreshToken()).pipe(
      switchMap(apiResponse => {
        this.tokenStorageService.setAccessToken('set access token here');
        const updatedRequest = this.addTokenToRequest(request, 'token_here');
        return next.handle(updatedRequest);
      }),
      catchError(error => {
        // Handle refresh token failure (e.g., logout user)
        this.tokenStorageService.clearTokens();
        this.authService.logout();
        return throwError(error);
      }),
    );
  }
}

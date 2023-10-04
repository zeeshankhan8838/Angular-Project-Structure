import { Injectable } from '@angular/core';
import { TokenStorageService } from '../token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly tokenStorageService: TokenStorageService) {}

  async logout(redirectTo: boolean = true) {
    await this.clearAppData();
  }

  async clearAppData() {
    localStorage.removeItem('accessToken');
  }

  public isAuthenticated(): boolean | null | '' {
    let accessToken = this.tokenStorageService.getAccessToken();
    return accessToken && accessToken.length > 0;
  }

  /**
   * @returns user decoded object from user token from API
   */
  getDecodedToken(): any {
    let token = this.tokenStorageService.getAccessToken() as string;
    if (!token) {
      this.logout();
      return null as any;
    }
    return this.parseJwt(token);
  }

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  getNameInitials() {
    let userData = this.getDecodedToken();
    return userData?.FirstName.charAt(0) + userData?.LastName.charAt(0);
  }

  getUserData() {
    return this.getDecodedToken();
  }

  async refreshToken() {
    // Implement your token refresh API call here
  }
}

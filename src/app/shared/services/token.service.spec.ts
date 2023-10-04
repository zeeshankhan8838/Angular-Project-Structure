import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from './token.service';

describe('TokenService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
    localStorage.removeItem('accessToken'); // Clean up after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null if token is null', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const token = service.getAccessToken();
    expect(token).toBeNull();
  });

  it('should return token if token is exist', () => {
    const fakeAccessToken = 'fakeAccessToken';
    spyOn(localStorage, 'getItem').and.returnValue(fakeAccessToken);
    const token = service.getAccessToken();
    expect(token).toBe(fakeAccessToken);
  });

  it('should set access token', () => {
    const fakeAccessToken = 'fakeAccessToken';
    service.setAccessToken(fakeAccessToken);
    const storedToken = service.getAccessToken();
    expect(storedToken).toBe(fakeAccessToken);
  });

  it('should return null if refresh token is null', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const token = service.getRefreshToken();
    expect(token).toBeNull();
  });

  it('should return token if refresh  token is exist', () => {
    const fakeAccessToken = 'fakeAccessToken';
    spyOn(localStorage, 'getItem').and.returnValue(fakeAccessToken);
    const token = service.getRefreshToken();
    expect(token).toBe(fakeAccessToken);
  });

  it('should set refresh token', () => {
    const fakeToken = 'fakeRefreshToken';
    service.setRefreshToken(fakeToken);
    const storeToken = service.getRefreshToken();
    expect(storeToken).toBe(fakeToken);
  });

  it('should clear the local storage', () => {
    spyOn(localStorage, 'removeItem');

    service.clearTokens();

    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
  });
});

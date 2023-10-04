import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { environment } from 'src/environments/environment';
import { ApiHandlerService } from '../api-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private apiService: ApiHandlerService) {}

  get(endpoint: string, params?: any, env?: string) {
    return lastValueFrom(this.apiService.Get(`${env ? env : environment.apiURL}` + endpoint, params));
  }

  post(endpoint: string | null, body?: any, params?: any) {
    return lastValueFrom(this.apiService.Post(`${environment.apiURL}` + endpoint, body, params));
  }

  put(endpoint: string | null, body?: any) {
    return lastValueFrom(this.apiService.Put(`${environment.apiURL}` + endpoint, body));
  }
  delete(endpoint: string, body?: any, params?: any) {
    return lastValueFrom(this.apiService.Delete(`${environment.apiURL}` + endpoint, body, params));
  }
}

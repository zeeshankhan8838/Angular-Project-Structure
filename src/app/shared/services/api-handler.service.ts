import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { IApiBaseActions, IApiBaseResponse, ParamsType } from '../interfaces/api-base-action.interface';
import { ResponseMessages } from '../constants/response-message';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService implements IApiBaseActions {
  constructor(public httpClient: HttpClient) {}

  Get(url: string, params?: ParamsType) {
    return this.httpClient.get<IApiBaseResponse>(url, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
  }

  GetAll(url: string, params?: ParamsType) {
    return this.httpClient.get<IApiBaseResponse>(url, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
  }

  Post(url: string, data: any, params?: ParamsType) {
    return this.httpClient.post<IApiBaseResponse>(url, data, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
  }

  Delete(url: string, data: any, params?: ParamsType) {
    return this.httpClient.delete<IApiBaseResponse>(url, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
  }

  Put(url: string, data: any, params?: ParamsType) {
    return this.httpClient.put<IApiBaseResponse>(url, data, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
  }

  HandleResponse(response: any) {
    if (response.Status === 500) {
      alert(ResponseMessages.serverError);
    }
  }

  createParams(params?: ParamsType) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.append(key, value);
      });
    }
    return httpParams;
  }
}

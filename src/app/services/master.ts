import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIResponseModel } from '../components/model/interface/role';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  http = inject(HttpClient);

  getDesignations() {
    return this.http.get<APIResponseModel>(
      '/api/ClientStrive/GetAllDesignation'
    );
  }
}

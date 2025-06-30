import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { APIResponseModel } from '../components/model/interface/role';
import { ClientClass } from '../components/model/class/Client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  http = inject(HttpClient);

  getAllClients() {
    return this.http.get<APIResponseModel>(
      environment.API_URL + 'GetAllClients'
    );
  }
  getAllEmployee() {
    return this.http.get<APIResponseModel>(
      environment.API_URL + 'GetAllEmployee'
    );
  }

  // saveClient(client: ClientClass) {
  //   // Convert client object to FormData
  //   const formData = new FormData();
  //   formData.append('clientId', client.clientId);
  //   formData.append('contactPersonName', client.contactPersonName);
  //   formData.append('companyName', client.companyName);
  //   formData.append('contactNo', client.contactNo);
  //   formData.append('city', client.city);
  //   formData.append('state', client.state);
  //   formData.append('pincode', client.pincode);
  //   formData.append('address', client.address);
  //   formData.append('EmployeeStrength', client.EmployeeStrength);
  //   formData.append('gstNo', client.gstNo);
  //   formData.append('regNo', client.regNo);
    
  //   return this.http.post<APIResponseModel>(
  //     environment.API_URL + 'AddUpdateClient',
  //     formData
  //   );
  // }

  // saveClient(client: ClientClass) {
  //   const formData = new FormData();
  //   formData.append('clientId', '0');  // Zawsze 0 dla nowych
  //   formData.append('contactPersonName', client.contactPersonName);
  //   formData.append('companyName', client.companyName);
  //   formData.append('address', client.address);
  //   formData.append('city', client.city);
  //   formData.append('pincode', client.pincode);
  //   formData.append('state', client.state);
  //   formData.append('EmployeeStrength', client.EmployeeStrength.toString());
  //   formData.append('gstNo', client.gstNo || '');
  //   formData.append('contactNo', client.contactNo);
  //   formData.append('regNo', client.regNo || '');
    
  //   return this.http.post<APIResponseModel>(
  //     environment.API_URL + 'AddUpdateClient',
  //     formData
  //   );
  // }

  // saveClient(client: ClientClass) {
  //   // Wyślij jako JSON zamiast FormData
  //   const clientData = {
  //     clientId: client.clientId,  // jako liczba
  //     contactPersonName: client.contactPersonName,
  //     companyName: client.companyName,
  //     contactNo: client.contactNo,
  //     city: client.city,
  //     state: client.state,
  //     pincode: client.pincode,
  //     address: client.address,
  //     EmployeeStrength: client.EmployeeStrength,  // jako liczba
  //     gstNo: client.gstNo || '',
  //     regNo: client.regNo || ''
  //   };
    
  //   return this.http.post<APIResponseModel>(
  //     environment.API_URL + 'AddUpdateClient',
  //     clientData  // JSON zamiast FormData
  //   );
  // }

  saveClient(client: ClientClass) {
   
    return this.http.post<APIResponseModel>(
      environment.API_URL + 'AddUpdateClient',
      client
    );
  }
  deleteClientById(id: number) {
    return this.http.delete<APIResponseModel>(
      environment.API_URL + 'DeleteClientByClientId?clientId=' + id
    );
  }
  // constructor() { }
}

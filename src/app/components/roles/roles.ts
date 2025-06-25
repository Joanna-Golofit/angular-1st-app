import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { IRole } from '../model/interface/role';

@Component({
  selector: 'app-roles',
  imports: [],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit {
  // constructor(private http: HttpClient) {}
  http = inject(HttpClient);
  roleList: IRole[] = [];

  ngOnInit(): void {
    // alert('test');
    this.getAllRoles();
  }

  getAllRoless() {
    this.http.get('/api/ClientStrive/GetAllRoles', { 
      responseType: 'text' // ← Tymczasowo jako text
    }).subscribe({
      next: (response: any) => {
        console.log('RAW RESPONSE:', response); // Zobacz co przychodzi
        // Spróbuj parsować ręcznie
        try {
          const jsonData = JSON.parse(response);
          console.log('PARSED JSON:', jsonData);
          this.roleList = jsonData.data;
        } catch(e) {
          console.error('JSON Parse Error:', e);
        }
      },
      error: (error) => {
        console.error('HTTP Error:', error);
      }
    });
  }

  // getAllRoles() {
  //   this.http.get('https://freeapi.miniprojectideas.com/api/ClientStrive/GetAllRoles').subscribe((response: any) => {
  //     this.roleList = response.data;
  //   });
  //   // this.http.get('/api/ClientStrive/GetAllRoles').subscribe((response: any) => {
  //   //   this.roleList = response.data;
  //   // });
  // }
  getAllRoles() {
    this.http.get('https://freeapi.miniprojectideas.com/api/ClientStrive/GetAllRoles').subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (response?.result && response?.data) {
          this.roleList = response.data;
          console.log('Roles loaded:', this.roleList.length);
        }
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }
}

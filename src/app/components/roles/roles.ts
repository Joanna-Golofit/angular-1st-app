import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { IRole } from '../model/interface/role';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-roles',
  imports: [],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  // constructor(private http: HttpClient) {}
  http = inject(HttpClient);
  roleList: IRole[] = [];
  isLoading = true;

  ngOnInit(): void {
    // alert('test');
    this.getAllRoles();
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
    this.http
      .get('https://freeapi.miniprojectideas.com/api/ClientStrive/GetAllRoles')
      .pipe(
        finalize(() => {
          this.isLoading = false; // ← ZAWSZE się wykona
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('API Response:', response);
          if (response?.result && response?.data) {
            this.roleList = response.data;
            console.log('Roles loaded:', this.roleList.length);
          }
        },
        error: (error) => {
          console.error('API Error:', error);
        },
      });
  }
}

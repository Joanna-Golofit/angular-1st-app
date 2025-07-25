import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../services/master';
import { APIResponseModel, IDesignation } from '../model/interface/role';

@Component({
  selector: 'app-designation',
  imports: [],
  templateUrl: './designation.html',
  styleUrl: './designation.css'
})
export class Designation implements OnInit{
 masterService = inject(MasterService)
 designationList: IDesignation[] = [];
 isLoading = true;

 ngOnInit(): void {
  this.masterService.getDesignations().subscribe((data: APIResponseModel) => { 
    console.log(data);
    this.designationList = data.data;
    this.isLoading = false;
  }, error => {
    console.log(error);
    alert('API Error');
    this.isLoading = false;
  });
 }
}

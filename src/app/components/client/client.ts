import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../services/client';
import { APIResponseModel } from '../model/interface/role';
import { ClientClass } from '../model/class/Client';

@Component({
  selector: 'app-client',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client.html',
  styleUrl: './client.css',
})
export class Client implements OnInit {
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  isLoading: boolean = true;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  deletingClientId: number | null = null;

  clientList: ClientClass[] = [];

  clientService = inject(ClientService);

  clientForm!: FormGroup;

  private initializeForm() {
    this.clientForm = this.fb.group({
      contactPersonName: [
        'Ania',
        [Validators.required, Validators.minLength(2)],
      ],
      companyName: ['aaa', [Validators.required]],
      contactNo: [
        '1234567890',
        [Validators.required, Validators.pattern('^[0-9]{6,12}$')],
      ],
      city: ['aa', [Validators.required]],
      state: ['aa', [Validators.required]],
      pincode: [
        '111111',
        [Validators.required, Validators.pattern('^[0-9]{6}$')],
      ],
      address: ['aa', [Validators.required]],
      EmployeeStrength: ['2', [Validators.required]],
      gstNo: ['gst', [Validators.required]],
      regNo: ['reg', [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  ngOnInit(): void {
    this.loadClient();
    this.initializeForm();
  }

  loadClient() {
    // this.isLoading = true;
    this.clientService.getAllClients().subscribe((res: APIResponseModel) => {
      this.clientList = res.data;
      this.isLoading = false;
    });
  }

  onSaveClient() {
    this.isSaving = true;
    if (this.clientForm?.invalid) {
      console.log('=== NIEPRAWIDŁOWE POLA ===');
      Object.keys(this.clientForm.controls).forEach((key) => {
        const control = this.clientForm.get(key);
        if (control?.invalid) {
          console.log(`❌ ${key}:`, control.errors);
          console.log(`   Wartość: "${control.value}"`);
        } else {
          console.log(`✅ ${key}: OK`);
        }
      });
      console.log('========================');
      this.isSaving = false;
      return;
    }

    if (this.clientForm?.valid) {
      // console.log('onSaveClient');
      // console.log('clientForm.value', this.clientForm.value);
      this.clientService.saveClient(this.clientForm.value).subscribe({
        next: (res: APIResponseModel) => {
          if (res.result) {
            this.isSaving = false;
            alert(res.message);
            this.clientForm.reset();
            this.loadClient();
          } else {
            alert(res.message);
          }
        },
        error: (error: any) => {
          this.isSaving = false;
          alert('Error: ' + JSON.stringify(error.error));
        },
      });
    }
  }

  onDeleteClient(clientId: number) {
    const shallDelete = confirm('Are you sure you want to delete this client?');
    if (!shallDelete) {
      return;
    }
    // this.isDeleting = true;
    this.deletingClientId = clientId;
    
    this.clientService.deleteClientById(clientId).subscribe({
      next: (res: APIResponseModel) => {
        if (res.result) {
          // this.isDeleting = false;
          this.deletingClientId = null;
          // alert(res.message);
          this.clientForm.reset();
          this.loadClient();
        } else {
          alert(res.message);
          this.deletingClientId = null;
        }
      },
      error: (error: any) => {
        // this.isDeleting = false;
        this.deletingClientId = null;
        alert('Error: ' + JSON.stringify(error.error));
      },
    });
  }

  // onDeleteClient(clientId: number) {
  //   this.isDeleting = true;
  //   this.clientService.deleteClientById(clientId).subscribe((res: APIResponseModel) => {
  //     this.loadClient();
  //     this.isDeleting = false;
  //   });
  // }

  onReset() {
    console.log('onReset');
  }
}

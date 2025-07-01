import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../services/client';
import {
  APIResponseModel,
  IEmployee,
} from '../model/interface/role';
import { ClientClass } from '../model/class/Client';
import { ClientProjectClass } from '../model/class/ClientProject.class';
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-client-project',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],

  templateUrl: './client-project.html',
  styleUrl: './client-project.css',
})
export class ClientProject implements OnInit {
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  toastService = inject(ToastService);

  isLoading: boolean = true;
  isSaving: boolean = false;
  isEdit: boolean = false;
  isDeleting: boolean = false;
  deletingClientId: number | null = null;
  editingClientId: number | null = null;

  clientList: ClientClass[] = [];
  employeeList: IEmployee[] = [];
  clientProjectList = signal<ClientProjectClass[]>([]);

  userList$: Observable<any> = new Observable<any>();

  clientService = inject(ClientService);

  projectForm!: FormGroup;

  private initializeForm() {
    const defaultProject = new ClientProjectClass();
    this.projectForm = this.fb.group({
      clientProjectId: [defaultProject.clientProjectId],
      projectName: [defaultProject.projectName, [Validators.required]],
      startDate: [defaultProject.startDate, [Validators.required]],
      expectedEndDate: [defaultProject.expectedEndDate, [Validators.required]],
      leadByEmpId: [defaultProject.leadByEmpId, [Validators.required]],
      completedDate: [defaultProject.completedDate],
      contactPerson: [defaultProject.contactPerson, [Validators.required]],
      contactPersonContactNo: [
        defaultProject.contactPersonContactNo,
        [Validators.required, Validators.pattern('^[0-9]{6,12}$')],
      ],
      totalEmpWorking: [
        defaultProject.totalEmpWorking,
        [Validators.required, Validators.min(1)],
      ],
      projectCost: [
        defaultProject.projectCost,
        [Validators.required, Validators.min(0)],
      ],
      projectDetails: [defaultProject.projectDetails, [Validators.required]],
      contactPersonEmailId: [
        defaultProject.contactPersonEmailId,
        [Validators.required, Validators.email],
      ],
      clientId: [defaultProject.clientId, [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  ngOnInit(): void {
    this.userList$ = this.clientService.getAllUser();
    this.getAllClient();
    this.getAllEmployee();
    this.initializeForm();
    this.getAllClientProject();
  }
  getAllEmployee() {
    this.clientService.getAllEmployee().subscribe((res: APIResponseModel) => {
      this.employeeList = res.data;
      this.isLoading = false;
    });
  }

  getAllClient() {
    // this.isLoading = true;
    this.clientService.getAllClients().subscribe((res: APIResponseModel) => {
      this.clientList = res.data;
      this.isLoading = false;
    });
  }
  getAllClientProject() {
    // this.isLoading = true;
    this.clientService.getAllClientProject().subscribe((res: APIResponseModel) => {
      console.log('res', res.data);
      this.clientProjectList.set(res.data);
      console.log('clientProjectList', this.clientProjectList());
      this.isLoading = false;
    });
  }

  onSaveProject() {
    this.isSaving = true;
    if (this.projectForm?.invalid) {
      console.log('=== NIEPRAWIDŁOWE POLA ===');
      Object.keys(this.projectForm.controls).forEach((key) => {
        const control = this.projectForm.get(key);
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

    if (this.projectForm?.valid) {
      // console.log('onSaveClient');
      // console.log('projectForm.value', this.projectForm.value);
      this.clientService.saveClientProject(this.projectForm.value).subscribe({
        next: (res: APIResponseModel) => {
          if (res.result) {
            this.isSaving = false;
            this.isEdit = false;
            this.editingClientId = null;
            this.toastService.showToast('success', res.message);
            // alert(res.message);
            this.projectForm.reset();
            this.getAllClientProject();
            // this.getAllClient();
          } else {
            alert(res.message);
          }
        },
        error: (error: any) => {
          this.isSaving = false;
          this.editingClientId = null;
          alert('Error: ' + JSON.stringify(error.error));
        },
      });
    }
  }
  // onEditClient(client: ClientClass) {
  //   this.projectForm = {...client};
  //   console.log('onEditClient');

  // }

  onEditClient(client: ClientClass) {
    // console.log("przed zmiana", this.projectForm);
    console.log('client fields:', Object.keys(client));
    this.editingClientId = client.clientId;
    this.isEdit = true;
    const clientData = {
      ...client,
      EmployeeStrength: Number((client as any).employeeStrength) || 0, // ← Konwertuj
    };
    console.log('client', client);
    this.projectForm.patchValue(clientData);
    this.projectForm.markAllAsTouched();
    console.log('onEditClient');
  }

  // onDeleteClient(clientId: number) {
  //   const shallDelete = confirm('Are you sure you want to delete this client?');
  //   if (!shallDelete) {
  //     return;
  //   }
  //   // this.isDeleting = true;
  //   this.deletingClientId = clientId;

  //   this.clientService.deleteClientById(clientId).subscribe({
  //     next: (res: APIResponseModel) => {
  //       if (res.result) {
  //         // this.isDeleting = false;
  //         this.deletingClientId = null;
  //         // alert(res.message);
  //         this.toastService.showToast('success', res.message);
  //         this.projectForm.reset();
  //         this.getAllClient();
  //       } else {
  //         alert(res.message);
  //         this.deletingClientId = null;
  //       }
  //     },
  //     error: (error: any) => {
  //       // this.isDeleting = false;
  //       this.deletingClientId = null;
  //       alert('Error: ' + JSON.stringify(error.error));
  //     },
  //   });
  // }

 

  onReset() {
    console.log('onReset');
    this.projectForm.reset();
    this.isEdit = false;
    this.editingClientId = null;
  }
}

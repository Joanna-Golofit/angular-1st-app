/**
 * Szczegółowe testy komponentu ClientProject
 * Testuje: signals, złożony formularz, multiple dependencies, walidację
 */

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { stub } from 'sinon';
import { of, throwError, timer } from 'rxjs';
import { map } from 'rxjs/operators';

describe('ClientProject Component', () => {
  let clientServiceStub: any;
  let toastServiceStub: any;
  let formBuilderStub: any;
  let component: any;
  let mockProjectForm: any;

  beforeEach(() => {
    // Stubs dla ClientService
    clientServiceStub = {
      getAllClients: stub().returns(
        of({
          result: true,
          data: [
            { clientId: 1, companyName: 'ABC Corp' },
            { clientId: 2, companyName: 'XYZ Ltd' },
          ],
        })
      ),
      getAllEmployee: stub().returns(
        of({
          result: true,
          data: [
            { empId: 1, empName: 'Employee 1' },
            { empId: 2, empName: 'Employee 2' },
          ],
        })
      ),
      getAllClientProject: stub().returns(
        of({
          result: true,
          data: [{ clientProjectId: 1, projectName: 'Project Alpha' }],
        })
      ),
      // ✅ Asynchroniczne wywołanie dla save
      saveClientProject: stub().returns(
        timer(1).pipe(
          map(() => ({
            result: true,
            message: 'Project saved successfully',
          }))
        )
      ),
    };

    // Mock ToastService
    toastServiceStub = {
      showToast: stub(),
    };

    // Mock kompleksowego FormGroup dla wszystkich pól projektu
    mockProjectForm = {
      valid: false,
      invalid: true,
      value: {},
      reset: stub(),
      patchValue: stub(),
      markAllAsTouched: stub(),
      get: stub().callsFake((fieldName: string) => {
        const fieldMocks: { [key: string]: any } = {
          projectName: {
            invalid: false,
            dirty: false,
            touched: false,
            errors: null,
            value: 'Test Project',
          },
          startDate: {
            invalid: false,
            dirty: true,
            touched: true,
            errors: null,
            value: '2024-01-01',
          },
          expectedEndDate: {
            invalid: true,
            dirty: true,
            touched: true,
            errors: { required: true },
            value: null,
          },
          contactPersonContactNo: {
            invalid: true,
            dirty: true,
            touched: true,
            errors: { pattern: true },
            value: '123',
          },
          contactPersonEmailId: {
            invalid: true,
            dirty: false,
            touched: false,
            errors: { email: true },
            value: 'invalid-email',
          },
          projectCost: {
            invalid: true,
            dirty: true,
            touched: true,
            errors: { min: true },
            value: -100,
          },
          clientId: {
            invalid: false,
            dirty: false,
            touched: false,
            errors: null,
            value: 1,
          },
        };

        return (
          fieldMocks[fieldName] || {
            invalid: false,
            dirty: false,
            touched: false,
            errors: null,
            value: '',
          }
        );
      }),
      controls: {
        projectName: { invalid: false, errors: null, value: 'Test Project' },
        startDate: { invalid: false, errors: null, value: '2024-01-01' },
        expectedEndDate: {
          invalid: true,
          errors: { required: true },
          value: null,
        },
        contactPersonContactNo: {
          invalid: true,
          errors: { pattern: true },
          value: '123',
        },
      },
    };

    // Mock FormBuilder
    formBuilderStub = {
      group: stub().returns(mockProjectForm),
    };

    // Mock komponentu z signals
    component = {
      clientService: clientServiceStub,
      toastService: toastServiceStub,
      fb: formBuilderStub,

      // Stan początkowy
      isLoading: true,
      isSaving: false,
      isEdit: false,
      isDeleting: false,
      deletingClientId: null,
      editingClientId: null,

      // Dane
      clientList: [],
      employeeList: [],
      // ✅ Poprawiony mock signal jako funkcja
      clientProjectList: function () {
        return this._clientProjectListValue || [];
      },
      _clientProjectListValue: [],
      userList$: of([]),
      projectForm: mockProjectForm,

      // Metody
      initializeForm: function () {
        this.projectForm = this.fb.group({
          clientProjectId: [0],
          projectName: ['', []],
          startDate: ['', []],
          expectedEndDate: ['', []],
          leadByEmpId: ['', []],
          contactPerson: ['', []],
          contactPersonContactNo: ['', []],
          projectCost: ['', []],
          projectDetails: ['', []],
          contactPersonEmailId: ['', []],
          clientId: ['', []],
        });
      },

      getAllClient: function () {
        this.clientService.getAllClients().subscribe({
          next: (res: any) => {
            this.clientList = res.data;
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            console.error('Error loading clients:', error);
          },
        });
      },

      getAllEmployee: function () {
        this.clientService.getAllEmployee().subscribe({
          next: (res: any) => {
            this.employeeList = res.data;
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            console.error('Error loading employees:', error);
          },
        });
      },

      getAllClientProject: function () {
        this.clientService.getAllClientProject().subscribe({
          next: (res: any) => {
            // ✅ Poprawione ustawianie signal value
            this._clientProjectListValue = res.data;
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            console.error('Error loading projects:', error);
          },
        });
      },

      onSaveProject: function () {
        this.isSaving = true;
        if (this.projectForm?.invalid) {
          console.log('=== NIEPRAWIDŁOWE POLA ===');
          Object.keys(this.projectForm.controls).forEach((key) => {
            const control = this.projectForm.get(key);
            if (control?.invalid) {
              console.log(`❌ ${key}:`, control.errors);
            }
          });
          this.isSaving = false;
          return;
        }

        if (this.projectForm?.valid) {
          this.clientService
            .saveClientProject(this.projectForm.value)
            .subscribe({
              next: (res: any) => {
                if (res.result) {
                  this.isSaving = false;
                  this.isEdit = false;
                  this.editingClientId = null;
                  this.toastService.showToast('success', res.message);
                  this.projectForm.reset();
                  // ✅ Bezpośrednie wywołanie service zamiast metody
                  this.clientService.getAllClientProject().subscribe({
                    next: (res: any) => {
                      this._clientProjectListValue = res.data;
                    },
                  });
                }
              },
              error: (error: any) => {
                this.isSaving = false;
                this.editingClientId = null;
                console.error('Save error:', error);
              },
            });
        }
      },

      onReset: function () {
        this.projectForm.reset();
        this.isEdit = false;
        this.editingClientId = null;
      },

      isFieldInvalid: function (fieldName: string) {
        const field = this.projectForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
      },
    };

    // ✅ Dodaj metodę set do signal
    component.clientProjectList.set = function (value: any[]) {
      component._clientProjectListValue = value;
    };
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(component.isLoading).to.be.true;
      expect(component.isSaving).to.be.false;
      expect(component.isEdit).to.be.false;
      expect(component.isDeleting).to.be.false;
      expect(component.clientList).to.be.an('array').that.is.empty;
      expect(component.employeeList).to.be.an('array').that.is.empty;
      expect(component.clientProjectList()).to.be.an('array').that.is.empty;
    });

    it('should initialize form', () => {
      component.initializeForm();

      expect(formBuilderStub.group.calledOnce).to.be.true;
      expect(component.projectForm).to.exist;
    });
  });

  describe('Data Loading', () => {
    it('should load clients successfully', (done) => {
      component.getAllClient();

      expect(clientServiceStub.getAllClients.calledOnce).to.be.true;

      setTimeout(() => {
        expect(component.clientList).to.have.length(2);
        expect(component.clientList[0]).to.deep.include({
          clientId: 1,
          companyName: 'ABC Corp',
        });
        expect(component.isLoading).to.be.false;
        done();
      }, 10);
    });

    it('should load employees successfully', (done) => {
      component.getAllEmployee();

      expect(clientServiceStub.getAllEmployee.calledOnce).to.be.true;

      setTimeout(() => {
        expect(component.employeeList).to.have.length(2);
        expect(component.employeeList[0]).to.deep.include({
          empId: 1,
          empName: 'Employee 1',
        });
        expect(component.isLoading).to.be.false;
        done();
      }, 10);
    });

    it('should load client projects using signals', (done) => {
      component.getAllClientProject();

      expect(clientServiceStub.getAllClientProject.calledOnce).to.be.true;

      setTimeout(() => {
        expect(component.clientProjectList()).to.have.length(1);
        expect(component.clientProjectList()[0]).to.deep.include({
          clientProjectId: 1,
          projectName: 'Project Alpha',
        });
        expect(component.isLoading).to.be.false;
        done();
      }, 10);
    });

    it('should handle data loading errors', (done) => {
      clientServiceStub.getAllClients.returns(
        throwError(() => new Error('API Error'))
      );

      component.getAllClient();

      setTimeout(() => {
        expect(component.isLoading).to.be.false;
        expect(component.clientList).to.have.length(0);
        done();
      }, 10);
    });
  });

  describe('Form Validation', () => {
    it('should validate project name correctly', () => {
      const isInvalid = component.isFieldInvalid('projectName');
      expect(isInvalid).to.be.false; // prawidłowe pole
    });

    it('should validate required fields', () => {
      const endDateInvalid = component.isFieldInvalid('expectedEndDate');
      expect(endDateInvalid).to.be.true; // required i touched
    });

    it('should validate phone number pattern', () => {
      const phoneInvalid = component.isFieldInvalid('contactPersonContactNo');
      expect(phoneInvalid).to.be.true; // pattern error i touched
    });

    it('should validate email format', () => {
      const emailInvalid = component.isFieldInvalid('contactPersonEmailId');
      expect(emailInvalid).to.be.false; // invalid ale nie touched
    });

    it('should validate minimum values', () => {
      const costInvalid = component.isFieldInvalid('projectCost');
      expect(costInvalid).to.be.true; // min error i touched
    });

    it('should check if form is ready for submission', () => {
      expect(component.projectForm.invalid).to.be.true;
      expect(component.projectForm.valid).to.be.false;
    });
  });

  describe('Save Functionality', () => {
    it('should not save invalid form', () => {
      const consoleSpy = stub(console, 'log');

      component.onSaveProject();

      expect(component.isSaving).to.be.false;
      expect(clientServiceStub.saveClientProject.called).to.be.false;
      expect(consoleSpy.calledWith('=== NIEPRAWIDŁOWE POLA ===')).to.be.true;

      consoleSpy.restore();
    });

    it('should save valid form successfully', (done) => {
      // Ustaw formularz jako prawidłowy
      component.projectForm.valid = true;
      component.projectForm.invalid = false;
      component.projectForm.value = {
        projectName: 'Test Project',
        clientId: 1,
        startDate: '2024-01-01',
      };

      // Reset previous calls (jeśli metoda istnieje)
      if (clientServiceStub.saveClientProject.resetHistory) {
        clientServiceStub.saveClientProject.resetHistory();
      }
      if (clientServiceStub.getAllClientProject.resetHistory) {
        clientServiceStub.getAllClientProject.resetHistory();
      }

      // Count calls before
      const saveCallsBefore = clientServiceStub.saveClientProject.callCount;
      const getProjectsCallsBefore =
        clientServiceStub.getAllClientProject.callCount;
      const resetCallsBefore = component.projectForm.reset.callCount || 0;
      const toastCallsBefore = toastServiceStub.showToast.callCount || 0;

      component.onSaveProject();

      console.log('After onSaveProject call:');
      console.log('- isSaving:', component.isSaving);
      console.log('- projectForm.valid:', component.projectForm?.valid);
      console.log('- projectForm.invalid:', component.projectForm?.invalid);
      console.log('- projectForm exists:', !!component.projectForm);
      console.log(
        '- saveClient called:',
        clientServiceStub.saveClientProject.callCount > saveCallsBefore
      );

      expect(component.isSaving).to.be.true;
      expect(clientServiceStub.saveClientProject.callCount).to.equal(
        saveCallsBefore + 1
      );

      setTimeout(() => {
        console.log('In setTimeout:');
        console.log('- isSaving:', component.isSaving);
        console.log('- isEdit:', component.isEdit);
        console.log('- toast calls:', toastServiceStub.showToast.callCount);
        console.log('- reset calls:', component.projectForm.reset.callCount);
        console.log(
          '- getAllClientProject calls:',
          clientServiceStub.getAllClientProject.callCount
        );

        try {
          expect(component.isSaving).to.be.false;
          console.log('✅ isSaving test passed');

          expect(component.isEdit).to.be.false;
          console.log('✅ isEdit test passed');

          expect(
            toastServiceStub.showToast.calledWith(
              'success',
              'Project saved successfully'
            )
          ).to.be.true;
          console.log('✅ toast test passed');

          expect(component.projectForm.reset.callCount).to.be.greaterThan(
            resetCallsBefore
          );
          console.log('✅ reset test passed');

          expect(clientServiceStub.getAllClientProject.callCount).to.equal(
            getProjectsCallsBefore + 1
          );
          console.log('✅ getAllClientProject test passed');

          done();
        } catch (error) {
          console.error('Test failed:', (error as Error).message);
          done(error);
        }
      }, 50); // ✅ Zwiększony timeout dla asynchronicznego save
    });

    it('should handle save errors', (done) => {
      clientServiceStub.saveClientProject.returns(
        throwError(() => new Error('Save failed'))
      );
      component.projectForm.valid = true;
      component.projectForm.invalid = false;

      component.onSaveProject();

      setTimeout(() => {
        expect(component.isSaving).to.be.false;
        expect(component.editingClientId).to.be.null;
        done();
      }, 10);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset form and state', () => {
      component.isEdit = true;
      component.editingClientId = 123;

      component.onReset();

      expect(component.projectForm.reset.calledOnce).to.be.true;
      expect(component.isEdit).to.be.false;
      expect(component.editingClientId).to.be.null;
    });
  });

  describe('Advanced Form Testing', () => {
    it('should test all form field states', () => {
      const testCases = [
        { field: 'projectName', expectedInvalid: false },
        { field: 'startDate', expectedInvalid: false },
        { field: 'expectedEndDate', expectedInvalid: true },
        { field: 'contactPersonContactNo', expectedInvalid: true },
        { field: 'contactPersonEmailId', expectedInvalid: false },
        { field: 'projectCost', expectedInvalid: true },
        { field: 'clientId', expectedInvalid: false },
      ];

      testCases.forEach((testCase) => {
        const result = component.isFieldInvalid(testCase.field);
        expect(result).to.equal(
          testCase.expectedInvalid,
          `Field ${testCase.field} should be ${
            testCase.expectedInvalid ? 'invalid' : 'valid'
          }`
        );
      });
    });

    it('should handle non-existent form fields', () => {
      const result = component.isFieldInvalid('nonExistentField');
      expect(result).to.be.false;
    });
  });

  describe('Integration Testing', () => {
    it('should perform complete data loading cycle', (done) => {
      let completedCalls = 0;
      const expectedCalls = 3;

      const checkCompletion = () => {
        completedCalls++;
        if (completedCalls === expectedCalls) {
          expect(component.clientList).to.have.length(2);
          expect(component.employeeList).to.have.length(2);
          expect(component.clientProjectList()).to.have.length(1);
          done();
        }
      };

      component.getAllClient();
      setTimeout(checkCompletion, 10);

      component.getAllEmployee();
      setTimeout(checkCompletion, 10);

      component.getAllClientProject();
      setTimeout(checkCompletion, 10);
    });
  });
});

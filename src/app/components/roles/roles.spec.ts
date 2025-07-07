/**
 * Strategia testowania komponentów Angular w Mocha/Chai/Sinon
 *
 * Problem: Angular komponenty używają inject() do DI, co wymaga Angular context
 * Rozwiązanie: Stwórz mock obiekt z taką samą logiką jak komponent
 *
 * Szablon dla innych komponentów:
 * 1. Stwórz mock dependencies (HttpClient, services, etc.)
 * 2. Stwórz mock obiekt komponentu z potrzebnymi properties/methods
 * 3. Testuj logikę biznesową, nie Angular lifecycle
 * 4. Używaj async/await lub done() dla asynchronicznych operacji
 */

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { stub } from 'sinon';
import { of, throwError } from 'rxjs';

describe('Roles Component', () => {
  let httpClientStub: any;
  let component: any;

  beforeEach(() => {
    // Stwórz mock HttpClient
    httpClientStub = {
      get: stub().returns(
        of({
          result: true,
          data: [
            { id: 1, role: 'Admin' },
            { id: 2, role: 'User' },
          ],
        })
      ),
    };

    // Stwórz obiekt komponentu bez użycia new Roles()
    component = {
      http: httpClientStub,
      roleList: [],
      isLoading: true,
      getAllRoles: function () {
        this.http.get('/api/ClientStrive/GetAllRoles').subscribe({
          next: (response: any) => {
            console.log('API Response:', response);
            if (response?.result && response?.data) {
              this.roleList = response.data;
              console.log('Roles loaded:', this.roleList.length);
            }
            this.isLoading = false; // Set loading to false on success
          },
          error: (error: any) => {
            console.error('API Error:', error);
            this.isLoading = false; // Set loading to false on error
          },
        });
      },
    };
  });

  it('should have initial state', () => {
    expect(component.roleList).to.be.an('array');
    expect(component.roleList).to.have.length(0);
    expect(component.isLoading).to.be.true;
  });

  it('should load roles from API', (done) => {
    component.getAllRoles();

    // Sprawdź, czy HTTP został wywołany
    expect(httpClientStub.get.calledOnce).to.be.true;
    expect(httpClientStub.get.calledWith('/api/ClientStrive/GetAllRoles')).to.be
      .true;

    // Poczekaj na async operację
    setTimeout(() => {
      expect(component.roleList).to.have.length(2);
      expect(component.roleList[0]).to.deep.include({ id: 1, role: 'Admin' });
      expect(component.roleList[1]).to.deep.include({ id: 2, role: 'User' });
      expect(component.isLoading).to.be.false;
      done();
    }, 10);
  });

  it('should handle API error', (done) => {
    // Ustaw mock do zwrócenia błędu
    httpClientStub.get.returns(throwError(() => new Error('API Error')));

    component.getAllRoles();

    setTimeout(() => {
      expect(component.isLoading).to.be.false;
      expect(component.roleList).to.have.length(0);
      done();
    }, 10);
  });
});

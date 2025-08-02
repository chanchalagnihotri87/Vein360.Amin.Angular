import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import Clinic from '../../container-allotment/shared/clinic.model';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private readonly baseUrl = `${environment.apiUrl}/clinics`;

  constructor(private httpClient: HttpClient) {}

  public addClinic(clinic: Clinic) {
    return this.httpClient.post(`${this.baseUrl}`, clinic);
  }

  public updateClinic(clinic: Clinic) {
    return this.httpClient.put(`${this.baseUrl}`, clinic);
  }

  public deleteClinic(id: number) {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
  public getClinics(userId: number) {
    return this.httpClient.get<Clinic[]>(`${this.baseUrl}/${userId}`);
  }

  public getClinic(clinicId: number) {
    return this.httpClient.get<Clinic>(`${this.baseUrl}/detail/${clinicId}`);
  }
}

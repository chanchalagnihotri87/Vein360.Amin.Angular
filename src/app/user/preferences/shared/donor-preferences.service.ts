import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import DonorPreferences from './donor-preferences.model';

@Injectable({
  providedIn: 'root',
})
export class DonorPreferencesService {
  private readonly baseUrl = `${environment.apiUrl}/donorpreferences`;

  constructor(private httpClient: HttpClient) {}

  savePreferences(preferences: DonorPreferences) {
    return this.httpClient.post(this.baseUrl, preferences);
  }

  getPreferences(donorId: number) {
    return this.httpClient.get<DonorPreferences>(`${this.baseUrl}/${donorId}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import AuthenticationResponse from './authentication-response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = `${environment.apiUrl}/accounts`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  signIn(username: string, password: string) {
    return this.httpClient.post<AuthenticationResponse>(
      `${this.baseUrl}/admin/signin`,
      {
        username: username,
        password: password,
      }
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.httpClient.put<AuthenticationResponse>(
      `${this.baseUrl}/changepassword`,
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
      }
    );
  }
}

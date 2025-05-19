import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = `${environment.apiUrl}/accounts/admin`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  signIn(email: string, password: string) {
    return this.httpClient.post<string>(`${this.baseUrl}/signin`, {
      email: email,
      password: password,
    });
  }
}

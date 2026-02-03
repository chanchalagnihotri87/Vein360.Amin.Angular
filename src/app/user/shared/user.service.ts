import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import CreateUserRequest from './create-user-request.model';
import User from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`; //This is the base url of this service

  constructor(private httpClient: HttpClient) {}

  public addUser(userRequest: CreateUserRequest) {
    return this.httpClient.post(`${this.baseUrl}`, userRequest);
  }

  public updatedUser(user: User) {
    return this.httpClient.put(`${this.baseUrl}`, user);
  }

  public getUsers() {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  public getUser(id: number) {
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`);
  }

  public deleteUser(id: number) {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}

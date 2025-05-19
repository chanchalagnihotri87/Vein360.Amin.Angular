import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Vein360Container from './vein-360-container.model';

@Injectable({
  providedIn: 'root',
})
export class ContainerService {
  private readonly baseUrl = `${environment.apiUrl}/containers`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getContainers() {
    return this.httpClient.get<Vein360Container[]>(this.baseUrl);
  }

  getAvailableContainers(containerTypeId: number) {
    return this.httpClient.get<Vein360Container[]>(
      `${this.baseUrl}/available/${containerTypeId}`
    );
  }

  addContainer(container: Vein360Container) {
    return this.httpClient.post<Vein360Container>(this.baseUrl, container);
  }

  updateContainer(container: Vein360Container) {
    debugger;
    return this.httpClient.put<Vein360Container>(this.baseUrl, container);
  }

  deleteContainer(containerId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${containerId}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Donation from './donation.model';
import ProcessedDonation from './processed-donation-model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly baseUrl = `${environment.apiUrl}/donations`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getDonations() {
    return this.httpClient.get<Donation[]>(this.baseUrl);
  }

  getDonationById(donationId: number) {
    return this.httpClient.get<Donation>(`${this.baseUrl}/${donationId}`);
  }

  updateDonation(donation: Donation) {
    debugger;
    return this.httpClient.put<Donation>(`${this.baseUrl}`, donation);
  }

  dispatchDonation(donationId: number) {
    return this.httpClient.patch(`${this.baseUrl}/dispatch/${donationId}`, {});
  }

  deleteDonation(donationId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${donationId}`);
  }

  processDonation(donation: ProcessedDonation) {
    return this.httpClient.patch<Donation>(`${this.baseUrl}/process`, donation);
  }
}

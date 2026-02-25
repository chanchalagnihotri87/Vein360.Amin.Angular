import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import PagedResponse from '../../shared/paged-response/paged-response';
import Donation from './donation.model';
import ProcessedDonation from './processed-donation-model';
import UpdatedDonation from './updated-donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly baseUrl = `${environment.apiUrl}/donations`; // Replace with your API URL

  constructor(private httpClient: HttpClient) {}

  getDonations(page: number) {
    return this.httpClient.get<PagedResponse<Donation>>(
      `${this.baseUrl}/all?page=${page}`,
    );
  }

  getDonationById(donationId: number) {
    return this.httpClient.get<Donation>(`${this.baseUrl}/${donationId}`);
  }

  updateDonation(donation: UpdatedDonation) {
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

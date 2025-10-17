import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import DonationContainer from '../../container-allotment/shared/donation-container.model';
import Product from '../../product/shared/product.model';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import { RejectionInfoComponent } from '../rejection-info/rejection-info.component';
import Donation from '../shared/donation.model';
import UpdatedDonation from '../shared/updated-donation.model';

@Component({
  selector: 'app-add',
  imports: [
    ReactiveFormsModule,
    ValidationMessageComponent,
    RejectionInfoComponent,
  ],
  templateUrl: './edit-donation.component.html',
  styleUrl: './edit-donation.component.scss',
})
export class EditDonationComponent implements OnInit {
  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) products: Product[] = [];

  public onSubmit = output<UpdatedDonation>();
  public onClose = output();

  protected length?: number;
  protected width?: number;
  protected height?: number;
  protected donationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.donationForm = this.createDonationForm();
  }

  ngOnInit(): void {
    this.fillDonationForm(this.donation!);
  }

  //#region  Public Methods

  public submitForm() {
    if (this.donationForm.valid) {
      let updatedDonation = new UpdatedDonation(
        this.donation!.id,
        this.donationForm.value.amount
      );

      this.onSubmit.emit(updatedDonation);
      this.onClose.emit();
    }
  }

  public closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region  Private Methods

  private createDonationForm() {
    return this.formBuilder.group({
      amount: ['', Validators.required],
    });
  }

  private fillDonationForm(donation: Donation) {
    this.donationForm.get('amount')?.setValue(donation.amount);
  }

  //#endregion
}

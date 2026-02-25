import { Component, Input, OnInit, output } from '@angular/core';
import Donation from '../shared/donation.model';

import Product from '../../product/shared/product.model';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ProcessedProduct from '../../product/shared/processed-product.model';
import ProcessedDonation from '../shared/processed-donation-model';

@Component({
  selector: 'process-donation',
  imports: [ReactiveFormsModule],
  templateUrl: './process-donation.component.html',
})
export class ProcessDonationComponent implements OnInit {
  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) products: Product[] = [];

  public onSubmit = output<ProcessedDonation>();
  public onClose = output();

  protected donationForm: FormGroup;

  protected get productFormControls() {
    return this.donationForm.get('products') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {
    this.donationForm = this.createDonationForm();
  }

  ngOnInit(): void {
    this.fillForm(this.donation);
  }

  //#region Public Methods

  public submitForm() {
    if (this.donationForm.valid) {
      debugger;
      const newDonation: ProcessedDonation = new ProcessedDonation(
        this.donation!.id,
        this.donationForm.value.products.map(
          (productItem: { id: number; accepted: number; rejected: number }) => {
            return new ProcessedProduct(
              productItem.id,
              productItem.accepted,
              productItem.rejected,
            );
          },
        ),
      );

      this.onSubmit.emit(newDonation);
      this.onClose.emit();
    }
  }

  public closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region Private Methods
  private createDonationForm() {
    return this.formBuilder.group({
      products: this.formBuilder.array([
        this.formBuilder.group({
          id: [this.formBuilder.control<number | null>(null)],
          accepted: [
            this.formBuilder.control<number | null>(null),
            Validators.required,
          ],
          rejected: [
            this.formBuilder.control<number | null>(null),
            Validators.required,
          ],
        }),
      ]),
    });
  }

  private fillForm(donation?: Donation) {
    this.productFormControls.at(0).patchValue({
      id: this.donation?.products[0].id,
      accepted: this.donation?.products[0].accepted,
      rejected: this.donation?.products[0].rejected,
    });

    if (this.donation!.products!.length > 1) {
      for (let i = 1; i < this.donation!.products.length; i++) {
        this.productFormControls.push(
          this.formBuilder.group({
            id: [this.formBuilder.control<number | null>(null)],
            accepted: [
              this.formBuilder.control<number | null>(null),
              Validators.required,
            ],
            rejected: [
              this.formBuilder.control<number | null>(null),
              Validators.required,
            ],
          }),
        );

        this.productFormControls.at(i).patchValue({
          id: this.donation?.products[i].id,
          accepted: this.donation?.products[i].accepted,
          rejected: this.donation?.products[i].rejected,
        });
      }

      console.log(this.donation);
    }
  }

  //#endregion
}

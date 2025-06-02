import { Component, Input, OnInit, output } from '@angular/core';
import DonationContainer from '../../container-allotment/shared/donation-container.model';
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
import { PackageType } from '../../shared/enums/package-type.enum';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import FedexService from '../shared/fedex.service';
import ProcessedDonation from '../shared/processed-donation-model';

@Component({
  selector: 'process-donation',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './process-donation.component.html',
})
export class ProcessDonationComponent implements OnInit {
  onClose = output();

  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) products: Product[] = [];

  onSubmit = output<ProcessedDonation>();

  public donationForm: FormGroup;

  constructor(
    private fedexPackService: FedexService,
    private formBuilder: FormBuilder
  ) {
    this.donationForm = this.createDonationForm();
  }

  ngOnInit(): void {
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
          })
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
              productItem.rejected
            );
          }
        )
      );

      this.onSubmit.emit(newDonation);
      this.onClose.emit();
    }
  }

  closeModal() {
    this.onClose.emit();
  }

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

  get productFormControls() {
    return this.donationForm.get('products') as FormArray;
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  // get associatedContainers(): ContainerListItem[] {
  //   if (this.donation?.packageType === ContainerType.FedexContainer) {
  //     return this.fedexPacks.map(
  //       (pack) => new ContainerListItem(pack.id, pack.description)
  //     );
  //   }

  //   return [];
  // }

  get ContainerType() {
    return PackageType;
  }
}

import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import DonationContainer from '../../container-allotment/shared/donation-container.model';
import Product from '../../product/shared/product.model';
import { PackageType } from '../../shared/enums/package-type.enum';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import { RejectionInfoComponent } from '../rejection-info/rejection-info.component';
import Donation from '../shared/donation.model';
import FedexService from '../shared/fedex.service';
import PackTypeService from '../shared/pack-type.service';
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

  public length?: number;
  public width?: number;
  public height?: number;
  public selectedContainerType: string;
  public donationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fedexPackService: FedexService,
    private packTypeService: PackTypeService
  ) {
    this.selectedContainerType = PackageType.CustomPackage.toString();
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

  public containerTypeChanged() {
    (this.donationForm.get('container') as FormControl)?.setValue(''); // Set
  }

  public closeModal() {
    this.onClose.emit();
  }

  public GetPackageTypeDesription(packageType?: number) {
    return this.packTypeService.GetPackageTypeDescription(packageType);
  }

  public GetFedexPackageDescription(fedexPackagingTypeId?: number) {
    return this.fedexPackService.GetFedexPackDescription(fedexPackagingTypeId);
  }

  //#endregion

  //#region Get Properties

  get PackageType() {
    return PackageType;
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  //#endregion

  //#region  Private Methods

  private createDonationForm() {
    return this.formBuilder.group({
      amount: ['', Validators.required],
    });
  }

  private fillDonationForm(donation: Donation) {
    this.selectedContainerType = donation.packageType.toString();

    this.donationForm.get('amount')?.setValue(donation.amount);
  }

  //#endregion
}

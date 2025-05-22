import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import ContainerListItem from '../../container/shared/container-list-item-model';
import DonationContainer from '../../container/shared/donation-container.model';
import Product from '../../product/shared/product.model';
import { ContainerType } from '../../shared/enums/container-type.enum';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import DonationProduct from '../shared/donation-product.model';
import Donation from '../shared/donation.model';
import FedexService from '../shared/fedex.service';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './edit-donation.component.html',
  styleUrl: './edit-donation.component.scss',
})
export class EditDonationComponent implements OnInit {
  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) products: Product[] = [];

  public onSubmit = output<Donation>();
  public onClose = output();

  public length?: number;
  public width?: number;
  public height?: number;
  public selectedContainerType: string;
  public donationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fedexPackService: FedexService
  ) {
    this.selectedContainerType = ContainerType.OwnCustomPacking.toString();
    this.donationForm = this.createDonationForm();
  }

  ngOnInit(): void {
    // this.setDefaultValuesInFormControls();
    this.subscribeToContainerTypeChange();
    this.fillDonationForm(this.donation!);
  }

  //#region  Public Methods

  public submitForm() {
    if (this.donationForm.valid) {
      let updatedDonation = new Donation(
        this.donationForm.value.containerType,
        this.donationForm.value.container != ''
          ? this.donationForm.value.container
          : null,
        this.donationForm.value.products.map(
          (productItem: {
            id: number;
            product: number;
            units: number;
            accepted?: number;
            rejected?: number;
          }) => {
            let donationProduct = new DonationProduct(
              productItem.product,
              productItem.units,
              productItem.accepted,
              productItem.rejected
            );
            donationProduct.id = productItem.id;

            return donationProduct;
          }
        ),
        this.selectedContainerType == ContainerType.OwnCustomPacking.toString()
          ? this.donationForm.value.length
          : undefined,
        this.selectedContainerType == ContainerType.OwnCustomPacking.toString()
          ? this.donationForm.value.width
          : undefined,
        this.selectedContainerType == ContainerType.OwnCustomPacking.toString()
          ? this.donationForm.value.height
          : undefined
      );

      updatedDonation.id = this.donation!.id;

      this.onSubmit.emit(updatedDonation);
      this.onClose.emit();
    }
  }

  public addProduct() {
    this.productFormControls.push(
      this.formBuilder.group({
        product: ['', Validators.required],
        units: ['', Validators.required],
        accepted: [0, Validators.required],
        rejected: [0, Validators.required],
      })
    );
  }

  public containerTypeChanged() {
    (this.donationForm.get('container') as FormControl)?.setValue(''); // Set
  }

  public closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region Get Properties

  get ContainerType() {
    return ContainerType;
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  get associatedContainers(): ContainerListItem[] {
    if (this.selectedContainerType === '') {
      return [];
    }

    if (
      this.selectedContainerType === ContainerType.FedexContainer.toString()
    ) {
      return this.fedexPacks.map(
        (pack) => new ContainerListItem(pack.id, pack.description)
      );
    }

    return this.containers.map(
      (item) =>
        new ContainerListItem(
          item.id,
          `#${item.id} ${item.containerType?.name} ${
            item.container?.containerCode
              ? `[${item.container?.containerCode}]`
              : ''
          }`
        )
    );
  }

  get containerTypeFormControl() {
    return this.donationForm.get('containerType') as FormControl;
  }

  get containerFormControl() {
    return this.donationForm.get('container') as FormControl;
  }

  get lengthFormControl() {
    return this.donationForm.get('length') as FormControl;
  }

  get widhtFormControl() {
    return this.donationForm.get('width') as FormControl;
  }

  get heightFormControl() {
    return this.donationForm.get('height') as FormControl;
  }

  get productFormControls() {
    return this.donationForm.get('products') as FormArray;
  }

  //#endregion

  //#region  Private Methods

  private createDonationForm() {
    return this.formBuilder.group({
      containerType: ['', Validators.required],
      container: ['', Validators.required],
      // weight: ['', Validators.required],
      weight: [''],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],

      products: this.formBuilder.array([
        this.formBuilder.group({
          product: [
            this.formBuilder.control<number | null>(null),
            Validators.required,
          ],
          units: [
            this.formBuilder.control<number | null>(null),
            Validators.required,
          ],
        }),
      ]),
    });
  }

  private fillDonationForm(donation: Donation) {
    this.selectedContainerType = donation.containerType.toString();
    this.donationForm.get('containerType')?.setValue(donation.containerType);
    this.donationForm.get('container')?.setValue(donation.containerId);
    this.donationForm.get('length')?.setValue(donation.length);
    this.donationForm.get('width')?.setValue(donation.width);
    this.donationForm.get('height')?.setValue(donation.height);

    this.donationForm.setControl(
      'products',
      this.formBuilder.array(
        donation.products.map((product) =>
          this.formBuilder.group({
            id: [product.id],
            product: [product.productId, Validators.required],
            units: [product.units, Validators.required],
            accepted: [product.accepted, Validators.required],
            rejected: [product.rejected, Validators.required],
          })
        )
      )
    );
  }

  private subscribeToContainerTypeChange() {
    this.donationForm.get('containerType')?.valueChanges.subscribe((val) => {
      this.updateContainerValidations(val);
      this.updateDimentionValidations(val);
    });
  }

  private updateContainerValidations(containerType: string) {
    if (containerType == ContainerType.OwnCustomPacking.toString()) {
      this.containerFormControl.clearValidators();
    } else {
      this.containerFormControl.setValidators([Validators.required]);
    }

    this.containerFormControl.updateValueAndValidity();
  }

  private updateDimentionValidations(containerType: string) {
    if (containerType == ContainerType.OwnCustomPacking.toString()) {
      this.lengthFormControl.setValidators([Validators.required]);
      this.widhtFormControl.setValidators([Validators.required]);
      this.heightFormControl.setValidators([Validators.required]);
    } else {
      this.lengthFormControl.clearValidators();
      this.widhtFormControl.clearValidators();
      this.heightFormControl.clearValidators();
    }

    this.lengthFormControl.updateValueAndValidity();
    this.widhtFormControl.updateValueAndValidity();
    this.heightFormControl.updateValueAndValidity();
  }
  //#endregion
}

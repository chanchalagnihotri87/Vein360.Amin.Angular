import { Component, Input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Clinic from '../../container-allotment/shared/clinic.model';
import Product from '../../product/shared/product.model';
import { AddressComponent } from '../../shared/address/address.component';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import { ClinicService } from '../../user/shared/clinic.service';
import { Order } from '../shared/order';
import { OrderStatus } from '../shared/order-status';
import UpdateOrderRequest from '../shared/update-order-request';

@Component({
  selector: 'app-edit-order',
  imports: [ReactiveFormsModule, ValidationMessageComponent, AddressComponent],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss',
})
export class EditOrderComponent {
  @Input({ required: true }) order?: Order;
  @Input({ required: true }) products: Product[] = [];

  public onClose = output();
  public onSubmit = output<UpdateOrderRequest>();

  protected orderForm: FormGroup;
  protected clinics: Clinic[] = [];

  protected get OrderStatus() {
    return OrderStatus;
  }

  constructor(
    private readonly clinicService: ClinicService,
    private readonly formBuilder: FormBuilder
  ) {
    this.orderForm = this.createOrderForm();
  }

  ngOnInit(): void {
    this.clinicService.getClinics(this.order!.userId).subscribe((clinics) => {
      this.clinics = clinics;
      this.fillClinicId(this.order!.clinic.id);
    });

    this.fillForm(this.order);
  }

  //#region Public Methods

  protected submitOrder() {
    if (this.orderForm.valid) {
      this.onSubmit.emit(
        new UpdateOrderRequest(
          this.order!.id,
          this.orderForm.value.productId,
          this.orderForm.value.quantity,
          this.orderForm.value.clinicId,
          this.orderForm.value.price,
          this.orderForm.value.status
        )
      );

      return;
    }
  }

  protected getOrderStatusDescription(orderStatus: OrderStatus) {
    return OrderStatus[orderStatus];
  }

  protected closeModal() {
    this.onClose.emit();
  }
  //#endregion

  //#region Private Methods
  private fillForm(order?: Order) {
    this.orderForm.setValue({
      productId: order!.product.id.toString(),
      clinicId: '',
      quantity: order!.quantity,
      price: order!.price,
      status: order!.status,
    });
  }

  private fillClinicId(clinicId?: number) {
    this.orderForm.patchValue({ clinicId: clinicId });
  }

  private createOrderForm() {
    return this.formBuilder.group({
      productId: ['', [Validators.required]],
      clinicId: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      price: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }
  //#endregion
}

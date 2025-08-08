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
import { OrderService } from '../shared/order.service';
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

  constructor(
    private readonly clinicService: ClinicService,
    private readonly formBuilder: FormBuilder,
    private readonly orderService: OrderService
  ) {
    this.orderForm = this.createOrderForm();
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

  ngOnInit(): void {
    console.log('Edit Order Componnent');
    console.log('Order');
    console.log(this.order);

    this.clinicService.getClinics(this.order!.userId).subscribe((clinics) => {
      this.clinics = clinics;
      this.orderForm.patchValue({ clinicId: this.order!.clinic.id });
    });

    this.orderForm.setValue({
      productId: this.order!.product.id.toString(),
      clinicId: '',
      quantity: this.order!.quantity,
      price: this.order!.price,
      status: this.order!.status,
    });
  }

  protected closeModal() {
    this.onClose.emit();
  }

  submitOrder() {
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

  get OrderStatus() {
    return OrderStatus;
  }

  getOrderStatusDescription(orderStatus: OrderStatus) {
    return OrderStatus[orderStatus];
  }
}

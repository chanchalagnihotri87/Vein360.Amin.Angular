import { Component, Input, OnInit, output } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import DonationContainer from '../../container-allotment/shared/donation-container.model';
import Product from '../../product/shared/product.model';
import { RejectionInfoComponent } from '../rejection-info/rejection-info.component';
import Donation from '../shared/donation.model';

@Component({
  selector: 'app-donation-detail',
  imports: [PopoverModule, RejectionInfoComponent],
  templateUrl: './donation-detail.component.html',
})
export class DonationDetailComponent implements OnInit {
  onClose = output();

  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) products: Product[] = [];

  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }
}

import { Component, input } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import DonationProduct from '../shared/donation-product.model';

@Component({
  selector: 'app-rejection-info',
  imports: [PopoverModule],
  template: `
    @if(donationProduct().rejected){

    <button
      type="button"
      class="btn-link btn-link-icon"
      [popover]="popOverTemplate"
      popoverTitle="Rejection Info"
      triggers="mouseenter: mouseleave"
    >
      <i class="fa fa-info-circle"></i>
    </button>
    <ng-template #popOverTemplate>
      @if(donationProduct().rejectedClogged){
      <p class="my-1">
        <span class="fw-bold">Clogged :</span>
        {{ donationProduct().rejectedClogged }}
      </p>
      } @if(donationProduct().rejectedDamaged){
      <p class="my-1">
        <span class="fw-bold">Damaged :</span>
        {{ donationProduct().rejectedDamaged }}
      </p>
      } @if(donationProduct().rejectedFunction){
      <p class="my-1">
        <span class="fw-bold">Function :</span>
        {{ donationProduct().rejectedFunction }}
      </p>
      } @if(donationProduct().rejectedKinked){
      <p class="my-1">
        <span class="fw-bold"> Kinked :</span>
        {{ donationProduct().rejectedKinked }}
      </p>
      } @if(donationProduct().rejectedOther){
      <p class="my-1">
        <span class="fw-bold">Other :</span>
        {{ donationProduct().rejectedOther }}
      </p>
      }
    </ng-template>
    }
  `,
})
export class RejectionInfoComponent {
  donationProduct = input.required<DonationProduct>();
}

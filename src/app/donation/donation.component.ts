import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BreadcrumbItem } from '../breadcrumb/shared/breadcrumb-item.model';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import { DonationContainerService } from '../container/shared/donation-container.service';
import { DonationStatus } from '../shared/enums/dontainer-status.enum';
import { ProcessDonationComponent } from './process-donation/process-donation.component';

import DonationContainer from '../container/shared/donation-container.model';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { ContainerType } from '../shared/enums/container-type.enum';
import { DonationDetailComponent } from './donation-detail/donation-detail.component';
import { EditDonationComponent } from './edit-donation/edit-donation.component';
import Donation from './shared/donation.model';
import { DonationService } from './shared/donation.service';
import ProcessedDonation from './shared/processed-donation-model';
import Product from './shared/product.model';
import { ProductService } from './shared/product.service';

@Component({
  selector: 'app-donation',
  imports: [DatePipe, TooltipModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss',
})
export class DonationComponent {
  public donations: Donation[] = [];

  private processDonationModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;
  private products: Product[] = [];
  private donationContainers: DonationContainer[] = [];

  constructor(
    private donationService: DonationService,
    private breadcrumbService: BreadcrumbService,
    private modalService: BsModalService,
    private productService: ProductService,
    private containerService: DonationContainerService
  ) {
    this.loadDonations();
    this.loadContainers();
    this.loadProducts();
    this.setBreadcrumb();
  }

  get DonationStatus() {
    return DonationStatus;
  }

  get ContainerType() {
    return ContainerType;
  }

  private loadDonations() {
    this.donationService.getDonations().subscribe((donations) => {
      console.log(donations);
      this.donations = donations;
    });
  }

  private loadContainers() {
    this.containerService
      .getContainers()
      .subscribe((containers: DonationContainer[]) => {
        console.log(containers);
        this.donationContainers = containers;
      });
  }

  private loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      console.log(products);
      this.products = products;
    });
  }

  private setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([
      new BreadcrumbItem('Donations', ''),
    ]);
  }

  private closeModal() {
    this.processDonationModalRef?.hide();
  }

  //#region Process Donation
  handleShowProcessDonation(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      console.log(donation);
      this.showProcessDonationModal(donation);
    });
  }

  private showProcessDonationModal(donation: Donation) {
    const configuartions: ModalOptions = {
      initialState: {
        donation: donation,
        products: this.products,
        containers: this.donationContainers,
      },
      class: 'modal-xl',
    };

    this.processDonationModalRef = this.modalService.show(
      ProcessDonationComponent,
      configuartions
    );

    this.processDonationModalRef.content.onSubmit.subscribe(
      (donation: ProcessedDonation) => {
        debugger;
        this.handleProcessDonation(donation);
        this.closeModal();
      }
    );

    this.processDonationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private handleProcessDonation(donation: ProcessedDonation) {
    this.donationService
      .processDonation(donation)
      .subscribe((dnt: Donation) => {
        debugger;
        console.log(donation);
        this.donations = this.donations.map((d) => (d.id === dnt.id ? dnt : d));
      });
  }

  //#endregion

  //#region Edit Donation
  handleShowEditDonation(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      console.log(donation);
      this.showEditDonationModal(donation);
    });
  }

  private showEditDonationModal(donation: Donation) {
    const configuartions: ModalOptions = {
      initialState: {
        donation: donation,
        products: this.products,
        containers: this.donationContainers,
      },
      class: 'modal-xl',
    };

    this.processDonationModalRef = this.modalService.show(
      EditDonationComponent,
      configuartions
    );

    this.processDonationModalRef.content.onSubmit.subscribe(
      (donation: Donation) => {
        debugger;
        this.handleEditDonation(donation);
        this.closeModal();
      }
    );

    this.processDonationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private handleEditDonation(donation: Donation) {
    this.donationService.updateDonation(donation).subscribe((dnt: Donation) => {
      debugger;
      console.log(donation);
      this.donations = this.donations.map((d) => (d.id === dnt.id ? dnt : d));
    });
  }

  //#endregion

  //#region Donation Detail
  handleShowDonationDetail(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      console.log(donation);
      this.showDonationDetailModal(donation);
    });
  }

  private showDonationDetailModal(donation: Donation) {
    const configuartions: ModalOptions = {
      initialState: {
        donation: donation,
        products: this.products,
        containers: this.donationContainers,
      },
      class: 'modal-xl',
    };

    this.processDonationModalRef = this.modalService.show(
      DonationDetailComponent,
      configuartions
    );

    this.processDonationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  //#endregion

  //#region Delete Donation
  handleDeleteDonation(dontationId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this donation?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationService.deleteDonation(dontationId).subscribe(() => {
        this.donations = this.donations.filter((d) => d.id != dontationId);
      });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  //#endregion
}

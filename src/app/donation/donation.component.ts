import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbItem } from '../breadcrumb/shared/breadcrumb-item.model';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import DonationContainer from '../container-allotment/shared/donation-container.model';
import { DonationContainerService } from '../container-allotment/shared/donation-container.service';
import Product from '../product/shared/product.model';
import { ProductService } from '../product/shared/product.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import Constants from '../shared/constants/constants';
import { DonationStatus } from '../shared/enums/dontainer-status.enum';
import { PackageType } from '../shared/enums/package-type.enum';
import { MessageDisplayService } from '../shared/message-display/message-display.service';
import PagedResponse from '../shared/paged-response/paged-response';
import { PagingControlComponent } from '../shared/paging/paging-control.component';
import { DonationDetailComponent } from './donation-detail/donation-detail.component';
import { EditDonationComponent } from './edit-donation/edit-donation.component';
import { ProcessDonationComponent } from './process-donation/process-donation.component';
import Donation from './shared/donation.model';
import { DonationService } from './shared/donation.service';
import ProcessedDonation from './shared/processed-donation-model';
import UpdatedDonation from './shared/updated-donation.model';

@Component({
  selector: 'app-donation',
  imports: [DatePipe, TooltipModule, PagingControlComponent],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss',
})
export class DonationComponent {
  public donations: Donation[] = [];
  public pagedDonations?: PagedResponse<Donation>;
  public donationsLoaded = false;
  private processDonationModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;
  private rejectionDetailModalRef?: BsModalRef;

  private products: Product[] = [];
  private donationContainers: DonationContainer[] = [];

  get DonationStatus() {
    return DonationStatus;
  }
  get PackageType() {
    return PackageType;
  }

  constructor(
    private donationService: DonationService,
    private breadcrumbService: BreadcrumbService,
    private modalService: BsModalService,
    private productService: ProductService,
    private containerService: DonationContainerService,
    private toast: ToastrService,
    private msgDisplayService: MessageDisplayService,
  ) {
    this.loadDonations(Constants.DefaultPageNo);
    this.loadContainers();
    this.loadProducts();
    this.setBreadcrumb();
  }

  //#region Public Methods

  protected handleShowProcessDonation(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      this.showProcessDonationModal(donation);
    });
  }

  protected handleShowEditDonation(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      this.showEditDonationModal(donation);
    });
  }

  protected handleShowDonationDetail(donationId: number) {
    this.donationService.getDonationById(donationId).subscribe((donation) => {
      this.showDonationDetailModal(donation);
    });
  }

  protected handleDeleteDonation(dontationId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this donation?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState,
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationService.deleteDonation(dontationId).subscribe(() => {
        this.donations = this.donations.filter((d) => d.id != dontationId);
        this.msgDisplayService.showSuccessMessage(
          'Donation deleted successfully.',
        );
      });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  //#endregion

  //#region Paging
  goToPage(page: number) {
    this.loadDonations(page);
  }
  //#endregion

  //#region Private Methods
  private loadDonations(page: number) {
    this.donationService.getDonations(page).subscribe((resp) => {
      this.pagedDonations = new PagedResponse<Donation>(
        resp.items,
        resp.totalPages,
        resp.currentPage,
      );
      this.donations = resp.items;
      this.donationsLoaded = true;
    });
  }

  private loadContainers() {
    this.containerService
      .getContainers()
      .subscribe((containers: DonationContainer[]) => {
        this.donationContainers = containers;
      });
  }

  private loadProducts() {
    this.productService
      .getDonationProductsAsListItems()
      .subscribe((products) => {
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
      configuartions,
    );

    this.processDonationModalRef.content.onSubmit.subscribe(
      (donation: ProcessedDonation) => {
        this.handleProcessDonation(donation);
        this.closeModal();
      },
    );

    this.processDonationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private handleProcessDonation(donation: ProcessedDonation) {
    this.donationService
      .processDonation(donation)
      .subscribe((dnt: Donation) => {
        this.donations = this.donations.map((d) => (d.id === dnt.id ? dnt : d));
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
      configuartions,
    );

    this.processDonationModalRef.content.onSubmit.subscribe(
      (updatedDonation: UpdatedDonation) => {
        this.handleEditDonation(updatedDonation);
        this.closeModal();
      },
    );

    this.processDonationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
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
      configuartions,
    );

    this.processDonationModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  private handleEditDonation(updatedDonation: UpdatedDonation) {
    this.donationService
      .updateDonation(updatedDonation)
      .subscribe((dnt: Donation) => {
        this.donations = this.donations.map((d) => (d.id === dnt.id ? dnt : d));
        this.msgDisplayService.showSuccessMessage(
          'Donation updated successfully.',
        );
      });
  }
  //#endregion
}

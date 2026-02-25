import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import Constants from '../shared/constants/constants';
import { DonationContainerStatus } from '../shared/enums/donation-container.status';
import { MessageDisplayService } from '../shared/message-display/message-display.service';
import PagedResponse from '../shared/paged-response/paged-response';
import { PagingControlComponent } from '../shared/paging/paging-control.component';
import { ApproveContainerRequestComponent } from './approve-container-request/approve-container-request.component';
import { ContainerRequestDetailComponent } from './container-request-detail/container-request-detail.component';
import ApproveContainerRequest from './shared/approve-container-request.model';
import ContainerType from './shared/container-type.model';
import { ContatinerTypeService } from './shared/contatiner-type.service';
import { DocumentService } from './shared/document.service';
import DonationContainer from './shared/donation-container.model';
import { DonationContainerService } from './shared/donation-container.service';

@Component({
  selector: 'app-container-allotment',
  imports: [DatePipe, PagingControlComponent],
  templateUrl: './container-allotment.component.html',
})
export class ContainerAllotmentComponent {
  protected containerTypes: ContainerType[] = [];
  protected pagedDonationContainers?: PagedResponse<DonationContainer>;
  protected donationContainersLoaded = false;

  protected get ContainerStatus() {
    return DonationContainerStatus;
  }

  private containerModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private donationContainerService: DonationContainerService,
    private containerTypeService: ContatinerTypeService,
    private modalService: BsModalService,
    private documentService: DocumentService,
    private breadcrumbService: BreadcrumbService,
    private msgDisplayService: MessageDisplayService,
  ) {}

  ngOnInit(): void {
    this.setBreadcrumb();
    this.loadDonationContainers(Constants.DefaultPageNo);
    this.loadContainerTypes();
  }

  //#region Public Methods
  public approveContainerRequest(containerId: number) {
    this.donationContainerService
      .getContainer(containerId)
      .subscribe((container) => {
        console.log(container);
        this.showApproveContainerRequestModal(container);
      });
  }

  public rejectContainerRequest(donationContainerId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to reject this request?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState,
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationContainerService
        .rejectRequest(donationContainerId)
        .subscribe(() => {
          this.loadDonationContainers(this.pageNo, () =>
            this.msgDisplayService.showSuccessMessage(
              'Request deleted successfully.',
            ),
          );
        });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  private get pageNo() {
    return this.pagedDonationContainers?.currentPage ?? Constants.DefaultPageNo;
  }

  public showContainerRequestDetail(donationContainerId: number) {
    this.donationContainerService
      .getContainer(donationContainerId)
      .subscribe((container) => {
        this.showContainerRequestDetailModal(container);
      });
  }

  public deleteContainerRequest(dontationId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this request?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState,
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationContainerService
        .deleteContainer(dontationId)
        .subscribe(() => {
          this.loadDonationContainers(this.pageNo, () =>
            this.msgDisplayService.showSuccessMessage(
              'Request deleted successfully.',
            ),
          );
        });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  public downloadLabel(labelFileName: string) {
    this.documentService
      .getLabel(labelFileName)
      .subscribe((labelData: Blob) => {
        this.documentService.downloadLabel(labelData, labelFileName);
      });
  }

  //#endregion

  //#region Paging
  goToPage(page: number) {
    this.loadDonationContainers(page);
  }
  //#endregion

  //#region  Private Methods

  private loadDonationContainers(page: number, callback?: () => void) {
    this.donationContainerService.getPagedContainers(page).subscribe((resp) => {
      this.pagedDonationContainers = new PagedResponse<DonationContainer>(
        resp.items,
        resp.totalPages,
        resp.currentPage,
      );

      this.donationContainersLoaded = true;

      if (callback) {
        callback();
      }
    });
  }

  private loadContainerTypes() {
    this.containerTypeService
      .getContainerTypes()
      .subscribe((containerTypes) => {
        this.containerTypes = containerTypes;
      });
  }

  private closeModal() {
    if (this.containerModalRef) {
      this.containerModalRef.hide();
    }
  }

  private showContainerRequestDetailModal(
    donationContainer: DonationContainer,
  ) {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        containerTypes: this.containerTypes,
        donationContainer: donationContainer,
      },
    };

    this.containerModalRef = this.modalService.show(
      ContainerRequestDetailComponent,
      initialState,
    );

    this.containerModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private showApproveContainerRequestModal(
    donationContainer: DonationContainer,
  ) {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        containerTypes: this.containerTypes,
        donationContainer: donationContainer,
      },
    };

    this.containerModalRef = this.modalService.show(
      ApproveContainerRequestComponent,
      initialState,
    );

    this.containerModalRef.content.onSubmit.subscribe(
      (approveContainerRequest: ApproveContainerRequest) => {
        this.donationContainerService
          .approveRequest(approveContainerRequest)
          .subscribe(() => {
            this.loadDonationContainers(this.pageNo, () =>
              this.msgDisplayService.showSuccessMessage(
                'Request approved successfully.',
              ),
            );
          });

        this.closeModal();
      },
    );

    this.containerModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  private setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([
      { label: 'Containers Allotment', path: '' },
    ]);
  }
  //#endregion
}

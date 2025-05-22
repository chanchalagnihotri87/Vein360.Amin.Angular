import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import ContainerType from '../container/shared/container-type.model';
import { ContatinerTypeService } from '../container/shared/contatiner-type.service';
import DonationContainer from '../container/shared/donation-container.model';
import { DonationContainerService } from '../container/shared/donation-container.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { DonationContainerStatus } from '../shared/enums/donation-container.status';
import { ApproveContainerRequestComponent } from './approve-container-request/approve-container-request.component';
import { ContainerRequestDetailComponent } from './container-request-detail/container-request-detail.component';
import ApproveContainerRequest from './shared/approve-container-request.model';
import { LabelService } from './shared/label.service';

@Component({
  selector: 'app-container-allotment',
  imports: [DatePipe],
  templateUrl: './container-allotment.component.html',
})
export class ContainerAllotmentComponent {
  public containerTypes: ContainerType[] = [];
  public donationContainers: DonationContainer[] = [];

  private containerModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private donationContainerService: DonationContainerService,
    private containerTypeService: ContatinerTypeService,
    private modalService: BsModalService,
    private labelService: LabelService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.setBreadcrumb();
    this.loadDonationContainers();
    this.loadContainerTypes();
  }

  //#region Public Methods
  public approveContainerRequest(containerId: number) {
    this.donationContainerService
      .getContainer(containerId)
      .subscribe((container) => {
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
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationContainerService
        .rejectRequest(donationContainerId)
        .subscribe(() => {
          this.loadDonationContainers();
        });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
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
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.donationContainerService
        .deleteContainer(dontationId)
        .subscribe(() => {
          this.loadDonationContainers();
        });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  public downloadLabel(labelFileName: string) {
    this.labelService.getLabel(labelFileName).subscribe((labelData: Blob) => {
      this.labelService.downloadLabel(labelData, labelFileName);
    });
  }

  //#endregion

  //#region Get Properties
  public get ContainerStatus() {
    return DonationContainerStatus;
  }

  //#endregion

  //#region  Private Methods

  private loadDonationContainers() {
    this.donationContainerService
      .getContainers()
      .subscribe((donationContainers) => {
        console.log(donationContainers);
        this.donationContainers = donationContainers;
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
    donationContainer: DonationContainer
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
      initialState
    );

    this.containerModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private showApproveContainerRequestModal(
    donationContainer: DonationContainer
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
      initialState
    );

    this.containerModalRef.content.onSubmit.subscribe(
      (approveContainerRequest: ApproveContainerRequest) => {
        this.donationContainerService
          .approveRequest(
            donationContainer.id,
            approveContainerRequest.containerId
          )
          .subscribe(() => {
            this.loadDonationContainers();
          });

        this.closeModal();
      }
    );

    this.containerModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([
      { label: 'Containers Allotment', path: '' },
    ]);
  }
  //#endregion
}

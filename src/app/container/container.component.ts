import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { Vein360ContainerStatus } from '../shared/enums/vein360-container-status';
import { AddContainerComponent } from './add-container/add-container.component';
import { ContainerDetailComponent } from './container-detail/container-detail.component';
import { EditContainerComponent } from './edit-container/edit-container.component';
import ContainerType from './shared/container-type.model';
import { ContainerService } from './shared/container.service';
import { ContatinerTypeService } from './shared/contatiner-type.service';
import Vein360Container from './shared/vein-360-container.model';

@Component({
  selector: 'app-container',
  imports: [],
  templateUrl: './container.component.html',
})
export class ContainerComponent {
  containers: Vein360Container[] = [];
  containerTypes: ContainerType[] = [];

  private containerModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private containerService: ContainerService,
    private breadcrumbService: BreadcrumbService,
    private containerTypeService: ContatinerTypeService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.setBreadcrumb();
    this.loadContainers();
    this.loadContainerTypes();
  }

  //#region Add Container

  showAddContainerModal() {
    const initialState: ModalOptions = {
      class: 'modal-md',
      initialState: {
        containerTypes: this.containerTypes,
      },
    };

    this.containerModalRef = this.modalService.show(
      AddContainerComponent,
      initialState
    );
    this.containerModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });

    this.containerModalRef.content.onSubmit.subscribe(
      (container: Vein360Container) => {
        this.handleAddContainer(container);
        this.closeModal();
      }
    );
  }

  handleAddContainer(container: Vein360Container) {
    this.containerService.addContainer(container).subscribe((container) => {
      this.containers = [container, ...this.containers];
    });
  }

  //#endregion

  //#region Edit Container

  showEditContainerModal(container: Vein360Container) {
    const initialState: ModalOptions = {
      class: 'modal-md',
      initialState: {
        containerTypes: this.containerTypes,
        container: container,
      },
    };

    this.containerModalRef = this.modalService.show(
      EditContainerComponent,
      initialState
    );
    this.containerModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });

    this.containerModalRef.content.onSubmit.subscribe(
      (container: Vein360Container) => {
        this.handleUpdateContainer(container);
        this.closeModal();
      }
    );
  }

  handleUpdateContainer(container: Vein360Container) {
    this.containerService.updateContainer(container).subscribe((container) => {
      this.containers = this.containers.map((c) => {
        if (c.id === container.id) {
          return container;
        }
        return c;
      });
    });
  }

  //#endregion

  //#region Container Detail

  showContainerDetailModal(container: Vein360Container) {
    const initialState: ModalOptions = {
      class: 'modal-md',
      initialState: {
        containerTypes: this.containerTypes,
        container: container,
      },
    };

    this.containerModalRef = this.modalService.show(
      ContainerDetailComponent,
      initialState
    );
    this.containerModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  //#endregion

  //#region Delete Container
  handleDeleteContainer(containerId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this container?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.containerService.deleteContainer(containerId).subscribe(() => {
        this.containers = this.containers.filter(
          (cnt) => cnt.id != containerId
        );
      });

      this.closeConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.closeConfirmationModal();
    });
  }

  //#endregion

  get ContainerStatus() {
    return Vein360ContainerStatus;
  }

  //#region Private Methods

  loadContainers() {
    this.containerService
      .getContainers()
      .subscribe((containers: Vein360Container[]) => {
        this.containers = containers;
      });
  }

  loadContainerTypes() {
    this.containerTypeService
      .getContainerTypes()
      .subscribe((containerTypes: ContainerType[]) => {
        this.containerTypes = containerTypes;
      });
  }

  setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([{ label: 'Containers', path: '' }]);
  }

  closeModal() {
    if (this.containerModalRef) {
      this.containerModalRef.hide();
    }
  }

  private closeConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  //#endregion
}

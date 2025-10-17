import { Component, input, output } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Clinic from '../container-allotment/shared/clinic.model';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { ClinicService } from '../user/shared/clinic.service';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { EditClinicComponent } from './edit-clinic/edit-clinic.component';
import { CountryService } from './shared/country.service';
import { StatesService } from './shared/state.service';

@Component({
  selector: 'app-clinic',
  imports: [],
  templateUrl: './clinic.component.html',
})
export class ClinicComponent {
  public userId = input.required<number>();
  public clinics = input.required<Clinic[]>();
  public onLoadClinics = output();

  private clinicModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private clinicService: ClinicService,
    private stateService: StatesService,
    private countryService: CountryService
  ) {}

  //#region Public Methods

  protected showAddClinicModal() {
    const configuartions: ModalOptions = {
      initialState: {},
      class: 'modal-xl',
      backdrop: 'static',
      keyboard: false,
    };

    this.clinicModalRef = this.modalService.show(
      AddClinicComponent,
      configuartions
    );

    this.clinicModalRef.content.onSubmit.subscribe((newClinic: Clinic) => {
      this.handleAddClinic(newClinic);
    });

    this.clinicModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  protected showEditClinicModal(clinicId: number) {
    this.clinicService.getClinic(clinicId).subscribe((clinic) => {
      this.openEditClinicModal(clinic);
    });
  }

  protected openEditClinicModal(clinic: Clinic) {
    console.log(clinic);
    const configuartions: ModalOptions = {
      initialState: {
        clinic,
      },
      class: 'modal-xl',
      backdrop: 'static',
      keyboard: false,
    };

    this.clinicModalRef = this.modalService.show(
      EditClinicComponent,
      configuartions
    );

    this.clinicModalRef.content.onSubmit.subscribe((clinic: Clinic) => {
      this.handleUpdateClinic(clinic);
    });

    this.clinicModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  protected getAddress(clinic: Clinic) {
    return `${clinic.addressLine1}, ${clinic.city}, ${
      this.stateService.getState(clinic.state)?.description
    } 
      ${this.countryService.getCountry(clinic.country)?.description} 
    ${clinic.postalCode}`;
  }

  protected handleDeleteDonation(clinicId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this clinic?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.clinicService.deleteClinic(clinicId).subscribe(() => {
        this.onLoadClinics.emit();
      });

      this.hideConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.hideConfirmationModal();
    });
  }

  //#endregion

  //#region Private Methods

  private handleAddClinic(clinic: Clinic) {
    clinic.userId = this.userId();
    this.clinicService.addClinic(clinic).subscribe(() => {
      this.onLoadClinics.emit();
    });
  }

  private handleUpdateClinic(clinic: Clinic) {
    this.clinicService.updateClinic(clinic).subscribe(() => {
      this.onLoadClinics.emit();
    });
  }

  private hideConfirmationModal() {
    this.confirmationModalRef?.hide();
  }

  private closeModal() {
    this.clinicModalRef?.hide();
  }
  //#endregion
}

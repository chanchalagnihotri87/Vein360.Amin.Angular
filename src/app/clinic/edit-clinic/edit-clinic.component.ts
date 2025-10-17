import { Component, Input, output } from '@angular/core';
import Clinic from '../../container-allotment/shared/clinic.model';
import { ClinicModalComponent } from '../shared/clinic-modal/clinic-modal.component';

@Component({
  selector: 'app-edit-clinic',
  imports: [ClinicModalComponent],
  templateUrl: './edit-clinic.component.html',
})
export class EditClinicComponent {
  @Input({ required: true }) clinic!: Clinic;
  onSubmit = output<Clinic>();
  onClose = output();

  constructor() {}

  submitForm(clinic: Clinic) {
    clinic.id = this.clinic.id;
    this.onSubmit.emit(clinic);
  }

  closeModal() {
    this.onClose.emit();
  }
}

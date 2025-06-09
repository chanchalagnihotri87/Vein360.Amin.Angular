import { Component, output } from '@angular/core';
import Clinic from '../../container-allotment/shared/clinic.model';
import { ClinicModalComponent } from '../shared/clinic-modal/clinic-modal.component';

@Component({
  selector: 'app-add-clinic',
  imports: [ClinicModalComponent],
  templateUrl: './add-clinic.component.html',
})
export class AddClinicComponent {
  onSubmit = output<Clinic>();
  onClose = output();

  constructor() {}

  closeModal() {
    this.onClose.emit();
  }

  submitForm(clinic: Clinic) {
    this.onSubmit.emit(clinic);
  }
}

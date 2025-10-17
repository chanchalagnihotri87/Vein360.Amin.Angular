import { Component, output } from '@angular/core';
import Clinic from '../../container-allotment/shared/clinic.model';
import { ClinicModalComponent } from '../shared/clinic-modal/clinic-modal.component';

@Component({
  selector: 'app-add-clinic',
  imports: [ClinicModalComponent],
  templateUrl: './add-clinic.component.html',
})
export class AddClinicComponent {
  public onSubmit = output<Clinic>();
  public onClose = output();

  constructor() {}

  submitForm(clinic: Clinic) {
    this.onSubmit.emit(clinic);
  }

  closeModal() {
    this.onClose.emit();
  }
}

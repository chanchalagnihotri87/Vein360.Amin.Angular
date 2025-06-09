import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Clinic from '../../../container-allotment/shared/clinic.model';
import { ValidationMessageComponent } from '../../../shared/validation-message/validation-message.component';
import { CountryService } from '../country.service';
import { StatesService } from '../state.service';

@Component({
  selector: 'app-clinic-modal',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './clinic-modal.component.html',
})
export class ClinicModalComponent implements OnInit {
  @Input() clinic?: Clinic;
  onSubmit = output<Clinic>();
  onClose = output();

  public clinicForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private stateService: StatesService,
    private countryService: CountryService
  ) {
    this.clinicForm = this.createClinicForm();
  }

  ngOnInit(): void {
    if (this.clinic) {
      this.clinicForm.patchValue({
        clinicCode: this.clinic.clinicCode,
        clinicName: this.clinic.clinicName,
        phone: this.clinic.phone,
        streetAddress: this.clinic.streetLine,
        city: this.clinic.city,
        state: this.clinic.state,
        country: this.clinic.country,
        postalCode: this.clinic.postalCode,
      });
    }
  }

  closeModal() {
    this.onClose.emit();
  }

  submitForm() {
    if (this.clinicForm.valid) {
      var newClinic = new Clinic(
        this.clinicForm.value.clinicCode,
        this.clinicForm.value.clinicName,
        this.clinicForm.value.phone,
        this.clinicForm.value.streetAddress,
        this.clinicForm.value.city,
        this.clinicForm.value.state,
        this.clinicForm.value.country,
        this.clinicForm.value.postalCode
      );

      this.onSubmit.emit(newClinic);
      this.onClose.emit();
    }
  }

  //#region Get Properties
  get states() {
    return this.stateService.getStates();
  }

  get countries() {
    return this.countryService.getCountries();
  }

  //#endregion

  //#region Private Methods
  createClinicForm() {
    return this.formBuilder.group({
      clinicName: ['', Validators.required],
      clinicCode: ['', Validators.required],
      phone: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  //#endregion
}

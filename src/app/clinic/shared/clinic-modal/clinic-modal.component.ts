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
        clinicName: this.clinic.clinicName,
        contactName: this.clinic.contactName,
        contactEmail: this.clinic.contactEmail,
        contactPhone: this.clinic.contactPhone,
        addressLine1: this.clinic.addressLine1,
        addressLine2: this.clinic.addressLine2,
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
        this.clinicForm.value.clinicName,
        this.clinicForm.value.contactName,
        this.clinicForm.value.contactEmail,
        this.clinicForm.value.contactPhone,
        this.clinicForm.value.addressLine1,
        this.clinicForm.value.addressLine2,
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
      contactName: [''],
      contactEmail: [''],
      contactPhone: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  //#endregion
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Clinic from '../../container-allotment/shared/clinic.model';
import DonorPreferences from './shared/donor-preferences.model';
import { DonorPreferencesService } from './shared/donor-preferences.service';

@Component({
  selector: 'app-preferences',
  imports: [ReactiveFormsModule],
  templateUrl: './preferences.component.html',
})
export class PreferencesComponent implements OnInit {
  @Input({ required: true }) clinics: Clinic[] = [];
  @Input({ required: true }) userId: number = 0;

  public preferencesForm: FormGroup;

  private preferences?: DonorPreferences;

  constructor(
    private formBuilder: FormBuilder,
    private donorPreferencesService: DonorPreferencesService
  ) {
    this.preferencesForm = this.createPreferecnesForm();
  }

  ngOnInit(): void {
    this.loadPreferences(this.userId);
  }

  createPreferecnesForm() {
    return this.formBuilder.group({
      defaultClinicId: [''],
    });
  }

  submitForm() {
    var preferences = new DonorPreferences(
      this.userId,
      this.preferencesForm.value.defaultClinicId
    );

    this.donorPreferencesService
      .savePreferences(preferences)
      .subscribe(() => {});
  }

  loadPreferences(donorId: number) {
    this.donorPreferencesService
      .getPreferences(donorId)
      .subscribe((preferences) => {
        this.preferences = preferences;
        this.loadPreferenceFormDefaultValues();
      });
  }

  loadPreferenceFormDefaultValues() {
    if (this.preferences && this.preferences.defaultClinicId) {
      this.preferencesForm.patchValue({
        defaultClinicId: this.preferences.defaultClinicId,
      });
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BreadcrumbItem } from '../../breadcrumb/shared/breadcrumb-item.model';
import { BreadcrumbService } from '../../breadcrumb/shared/breadcrumb.service';
import Clinic from '../../container-allotment/shared/clinic.model';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClinicComponent } from '../../clinic/clinic.component';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import { PreferencesComponent } from '../preferences/preferences.component';
import { ClinicService } from '../shared/clinic.service';
import User from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-edit-user',
  imports: [
    ClinicComponent,
    ReactiveFormsModule,
    ValidationMessageComponent,
    PreferencesComponent,
  ],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  @Input({ required: true }) id: number = 0;

  public clinics: Clinic[] = [];
  public currentTab: 'UserDetail' | 'Clinics' | 'Preferences' = 'UserDetail';

  public userForm: FormGroup;

  private clinicModalRef?: BsModalRef;
  private user?: User;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private clinicService: ClinicService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.setBreadcrumb();
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadClinics();
    this.loadUser(this.id);
  }

  showUserDetail() {
    this.currentTab = 'UserDetail';
  }

  showClinics() {
    this.currentTab = 'Clinics';
  }

  showPreferences() {
    this.currentTab = 'Preferences';
  }

  //#region  Public Methods

  public submitForm() {
    if (this.userForm.valid) {
      var updatedUser = new User(
        this.user!.id,
        this.userForm.value.email,
        this.userForm.value.isDonor,
        this.userForm.value.isAdmin
      );

      this.userService.updatedUser(updatedUser).subscribe(() => {});
    }
  }

  public goBackToUsersPage() {
    this.router.navigate(['user']);
  }

  //#endregion

  //#region Get Properties

  get userDetailTabIsActive() {
    return this.currentTab == 'UserDetail';
  }

  get clinicsTabIsActive() {
    return this.currentTab == 'Clinics';
  }

  get preferencesTabIsActive() {
    return this.currentTab == 'Preferences';
  }
  //#endregion

  //#region Private Methods

  public loadClinics() {
    this.clinicService.getClinics(this.id).subscribe((clinics) => {
      this.clinics = clinics;
    });
  }

  private setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([
      new BreadcrumbItem('Users', 'user'),
      new BreadcrumbItem('Edit', ''),
    ]);
  }

  private createUserForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      isDonor: [false],
      isAdmin: [false],
    });
  }

  private loadUser(userId: number) {
    this.userService.getUser(userId).subscribe((user) => {
      this.user = user;
      this.fillForm(user);
    });
  }

  private fillForm(user: User) {
    this.userForm?.patchValue({
      email: user.email,
      isDonor: user.isDonor,
      isAdmin: user.isAdmin,
    });
  }
  //#endregion
}

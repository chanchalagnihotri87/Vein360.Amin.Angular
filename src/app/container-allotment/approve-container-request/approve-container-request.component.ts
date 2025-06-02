import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DatePipe } from '@angular/common';

import { Vein360ContainerStatus } from '../../shared/enums/vein360-container-status';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ApproveContainerRequest from '../shared/approve-container-request.model';
import ContainerType from '../shared/container-type.model';
import DonationContainer from '../shared/donation-container.model';

@Component({
  selector: 'app-approve-container-request',
  imports: [DatePipe, ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './approve-container-request.component.html',
})
export class ApproveContainerRequestComponent implements OnInit {
  @Input({ required: true }) containerTypes: ContainerType[] = [];
  @Input({ required: true }) donationContainer?: DonationContainer;

  public onSubmit = output<ApproveContainerRequest>();
  public onClose = output();

  public containerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.containerForm = this.createContainerForm();
  }

  ngOnInit(): void {}

  //#region  Public Methods

  public submitForm() {
    if (this.containerForm.valid) {
      const approveRequest = new ApproveContainerRequest(
        this.donationContainer!.id,
        this.containerForm.value.approvedUnits
      );

      debugger;

      this.onSubmit.emit(approveRequest);
    }
  }

  public closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region Get Properties

  get ContainerType() {
    return ContainerType;
  }

  get Vein360ContainerStatus() {
    return Vein360ContainerStatus;
  }

  //#endregion

  //#region Private Methods

  createContainerForm(): FormGroup {
    return this.formBuilder.group({
      dontainerContainerId: [this.donationContainer?.id],
      approvedUnits: ['', [Validators.required]],
    });
  }

  //#endregion
}

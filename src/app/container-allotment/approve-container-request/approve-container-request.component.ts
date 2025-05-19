import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DatePipe } from '@angular/common';
import ContainerType from '../../container/shared/container-type.model';
import { ContainerService } from '../../container/shared/container.service';
import DonationContainer from '../../container/shared/donation-container.model';
import Vein360Container from '../../container/shared/vein-360-container.model';
import { Vein360ContainerStatus } from '../../shared/enums/vein360-container-status';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ApproveContainerRequest from '../shared/approve-container-request.model';

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

  public containers: Vein360Container[] = [];
  public containerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private containerService: ContainerService
  ) {
    this.containerForm = this.createContainerForm();
  }

  ngOnInit(): void {
    this.loadContainers(this.donationContainer!.containerType!.id);
  }

  //#region  Public Methods

  public submitForm() {
    if (this.containerForm.valid) {
      const approveRequest = new ApproveContainerRequest(
        this.containerForm.value.dontainerContainerId,
        this.containerForm.value.containerId
      );

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
  loadContainers(containerTypeId: number) {
    this.containerService
      .getAvailableContainers(containerTypeId)
      .subscribe((containers) => {
        this.containers = containers;
      });
  }

  createContainerForm(): FormGroup {
    return this.formBuilder.group({
      dontainerContainerId: [this.donationContainer?.id],
      containerId: ['', [Validators.required]],
    });
  }

  //#endregion
}

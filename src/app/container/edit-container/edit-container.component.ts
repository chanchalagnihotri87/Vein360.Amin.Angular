import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Vein360ContainerStatus } from '../../shared/enums/vein360-container-status';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ContainerType from '../shared/container-type.model';
import Vein360Container from '../shared/vein-360-container.model';

@Component({
  selector: 'app-edit-container',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './edit-container.component.html',
})
export class EditContainerComponent implements OnInit {
  @Input({ required: true }) containerTypes: ContainerType[] = [];
  @Input({ required: true }) container?: Vein360Container;

  public onSubmit = output<Vein360Container>();
  public onClose = output();

  public containerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.containerForm = this.createContainerForm();
  }

  ngOnInit(): void {
    this.fillForm(this.container!);
  }

  //#region  Public Methods

  public submitForm() {
    if (this.containerForm.valid) {
      const updatedContainer = new Vein360Container(
        this.containerForm.value.containerTypeId,
        this.containerForm.value.containerCode,
        this.containerForm.value.status
      );
      updatedContainer.id = this.container!.id;

      this.onSubmit.emit(updatedContainer);
      this.onClose.emit();
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

  get containerTypeFormControl() {
    return this.containerForm.get('containerType') as FormControl;
  }

  get containerCodeFormControl() {
    return this.containerForm.get('containerCode') as FormControl;
  }

  //#endregion

  //#region  Private Methods

  private createContainerForm() {
    return this.formBuilder.group({
      containerTypeId: ['', Validators.required],
      containerCode: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  private fillForm(container: Vein360Container) {
    this.containerForm.patchValue({
      containerTypeId: container?.containerTypeId,
      containerCode: container?.containerCode,
      status: container?.status,
    });
  }

  //#endregion
}

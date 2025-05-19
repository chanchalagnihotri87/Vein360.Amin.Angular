import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ContainerType from '../shared/container-type.model';
import Vein360Container from '../shared/vein-360-container.model';

@Component({
  selector: 'app-add-container',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './add-container.component.html',
})
export class AddContainerComponent implements OnInit {
  @Input({ required: true }) containerTypes: ContainerType[] = [];

  public onSubmit = output<Vein360Container>();
  public onClose = output();

  public containerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.containerForm = this.createContainerForm();
  }

  ngOnInit(): void {}

  //#region  Public Methods

  public submitForm() {
    if (this.containerForm.valid) {
      const newContainer = new Vein360Container(
        this.containerForm.value.containerType,
        this.containerForm.value.containerCode
      );
      debugger;
      this.onSubmit.emit(newContainer);
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
      containerType: ['', Validators.required],
      containerCode: ['', Validators.required],
    });
  }

  //#endregion
}

import { Component, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import CreateUserRequest from '../shared/create-user-request.model';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  onSubmit = output<CreateUserRequest>();
  onClose = output();

  public userForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.createUserForm();
  }

  //#region Public Methods

  public submitForm() {
    if (this.userForm.valid) {
      let newUserRequest = new CreateUserRequest(
        this.userForm.value.username,
        this.userForm.value.password,
        this.userForm.value.isBuyer,
        this.userForm.value.isDonor,
        this.userForm.value.isAdmin,
        this.userForm.value.isApiUser
      );

      this.onSubmit.emit(newUserRequest);
    }
  }

  public closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region Private Methods
  private createUserForm() {
    return this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      isDonor: [false],
      isAdmin: [false],
      isBuyer: [false],
      isApiUser: [false],
    });
  }

  //#endregion
}

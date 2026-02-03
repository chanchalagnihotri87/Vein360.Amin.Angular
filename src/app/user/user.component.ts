import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BreadcrumbItem } from '../breadcrumb/shared/breadcrumb-item.model';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { MessageDisplayService } from '../shared/message-display/message-display.service';
import { AddUserComponent } from './add-user/add-user.component';
import CreateUserRequest from './shared/create-user-request.model';
import User from './shared/user.model';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  public users: User[] = [];

  private userModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private msgDisplayService: MessageDisplayService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.setBreadcrumb();
  }

  //#region Public Methods

  showAddUserModal() {
    const configuartions: ModalOptions = {
      initialState: {},
      class: 'modal-xl',
      backdrop: 'static',
      keyboard: false,
    };

    this.userModalRef = this.modalService.show(
      AddUserComponent,
      configuartions,
    );

    this.userModalRef.content.onSubmit.subscribe(
      (userRequest: CreateUserRequest) => {
        this.handleAddUser(userRequest);
      },
    );

    this.userModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  getRoles(user: User) {
    let roles = 'Customer';

    if (user.isDonor) {
      roles += ', Donor';
    }

    if (user.isAdmin) {
      roles += ', Admin';
    }

    return roles;
  }

  editUser(user: User) {
    this.router.navigate(['/user', user.id]);
  }

  deleteUser(userId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this user?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState,
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });

      this.closeConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.closeConfirmationModal();
    });
  }

  //#endregion

  //#region Private Methods
  private handleAddUser(userRequest: CreateUserRequest) {
    this.userService.addUser(userRequest).subscribe(() => {
      this.loadUsers(() =>
        this.msgDisplayService.showSuccessMessage('User added successfully.'),
      );
      this.closeModal();
    });
  }

  private closeModal() {
    if (this.userModalRef != null) {
      this.userModalRef.hide();
    }
  }

  private closeConfirmationModal() {
    if (this.confirmationModalRef != null) {
      this.confirmationModalRef.hide();
    }
  }

  private loadUsers(callback?: () => void) {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      if (callback) {
        callback();
      }
    });
  }

  private setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([new BreadcrumbItem('Users', '')]);
  }
  //#endregion
}

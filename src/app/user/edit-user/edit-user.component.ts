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
import Product from '../../product/shared/product.model';
import { ProductService } from '../../product/shared/product.service';
import { TradeType } from '../../product/shared/trade-type.enum';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import { PreferencesComponent } from '../preferences/preferences.component';
import { ProductRatesComponent } from '../product-rates/product-rates.component';
import { ProductRateService } from '../product-rates/shared/product-rate.service';
import ProductRate from '../product-rates/shared/product.rate.model';
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
    ProductRatesComponent,
  ],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  @Input({ required: true }) id: number = 0;

  public clinics: Clinic[] = [];
  public saleProducts: Product[] = [];
  public donationProducts: Product[] = [];
  public productRates: ProductRate[] = [];
  public currentTab:
    | 'UserDetail'
    | 'Clinics'
    | 'Preferences'
    | 'DonationRates'
    | 'SaleRates' = 'UserDetail';
  public productsLoaded = false;
  public productRatesLoaded = false;

  public userForm: FormGroup;

  private clinicModalRef?: BsModalRef;
  private user?: User;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private clinicService: ClinicService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private productRateService: ProductRateService
  ) {
    this.setBreadcrumb();
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadClinics();
    this.loadUser(this.id);
    this.loadProducts(this.id);
    this.loadProductRates(this.id);
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

  showDonationRates() {
    this.currentTab = 'DonationRates';
  }

  showSaleRates() {
    this.currentTab = 'SaleRates';
  }

  //#region  Public Methods

  public submitForm() {
    if (this.userForm.valid) {
      var updatedUser = new User(
        this.user!.id,
        this.userForm.value.username,
        this.userForm.value.isBuyer,
        this.userForm.value.isDonor,
        this.userForm.value.isAdmin,
        this.userForm.value.isApiUser
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

  get donationRatesTabIsActive() {
    return this.currentTab == 'DonationRates';
  }

  get saleRatesTabIsActive() {
    return this.currentTab == 'SaleRates';
  }

  get TradeType() {
    return TradeType;
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
      username: ['', Validators.required],
      isBuyer: [false],
      isDonor: [false],
      isAdmin: [false],
      isApiUser: [false],
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
      username: user.username,
      isBuyer: user.isBuyer,
      isDonor: user.isDonor,
      isAdmin: user.isAdmin,
      isApiUser: user.isApiUser,
    });
  }

  private loadProducts(userId: number) {
    this.productService.getProducts().subscribe((products) => {
      this.saleProducts = products.filter((x) => x.trade == TradeType.Sale);
      this.donationProducts = products.filter((x) => x.trade == TradeType.Sort);
      this.productsLoaded = true;
    });
  }

  private loadProductRates(userId: number) {
    this.productRateService
      .getProductRates(userId)
      .subscribe((productRates) => {
        this.productRates = productRates;
        this.productRatesLoaded = true;
      });
  }
  //#endregion
}

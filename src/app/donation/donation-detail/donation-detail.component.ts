import { Component, Input, OnInit, output } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import ContainerListItem from '../../container-allotment/shared/container-list-item-model';
import DonationContainer from '../../container-allotment/shared/donation-container.model';
import Product from '../../product/shared/product.model';
import { PackageType } from '../../shared/enums/package-type.enum';
import { RejectionInfoComponent } from '../rejection-info/rejection-info.component';
import Donation from '../shared/donation.model';
import FedexService from '../shared/fedex.service';
import PackTypeService from '../shared/pack-type.service';

@Component({
  selector: 'app-donation-detail',
  imports: [PopoverModule, RejectionInfoComponent],
  templateUrl: './donation-detail.component.html',
})
export class DonationDetailComponent implements OnInit {
  onClose = output();

  @Input({ required: true }) donation?: Donation;
  @Input({ required: true }) containers: DonationContainer[] = [];
  @Input({ required: true }) products: Product[] = [];

  constructor(
    private fedexPackService: FedexService,
    private packTypeService: PackTypeService
  ) {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }

  get fedexPacks() {
    return this.fedexPackService.FedexPacks;
  }

  get associatedContainers(): ContainerListItem[] {
    if (this.donation?.packageType === PackageType.FedexPackage) {
      return this.fedexPacks.map(
        (pack) => new ContainerListItem(pack.id, pack.description)
      );
    }

    return [];
  }

  get PackageType() {
    return PackageType;
  }

  public GetPackageTypeDesription(packageType?: number) {
    return this.packTypeService.GetPackageTypeDescription(packageType);
  }

  public GetFedexPackageDescription(fedexPackagingTypeId?: number) {
    return this.fedexPackService.GetFedexPackDescription(fedexPackagingTypeId);
  }
}

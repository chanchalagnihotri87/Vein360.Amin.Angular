import Clinic from '../../container-allotment/shared/clinic.model';
import { DonationStatus } from '../../shared/enums/dontainer-status.enum';
import { UserListItem } from '../../user/shared/user-list-item.model';
import ContainerType from './container-type.model';
import DonationProduct from './donation-product.model';

export default class Donation {
  id: number = 0;
  clinicId: number;
  productTypes: string[] = [];
  trackingNumber?: string;
  useOldLabel: boolean = false;
  labelFileName: string = '';
  labelPath?: string;
  createdDate: Date = new Date();
  status: DonationStatus = DonationStatus.Donated;
  amount?: number;

  products: DonationProduct[];
  containerType?: ContainerType;
  clinic?: Clinic;
  donor?: UserListItem;

  constructor(
    clinicId: number,
    products: DonationProduct[],
    trackingNumber?: string
  ) {
    this.clinicId = clinicId;
    this.products = products;
    this.trackingNumber = trackingNumber;
  }

  get ProductIds(): number[] {
    return this.products.map((product) => product.productId);
  }
}

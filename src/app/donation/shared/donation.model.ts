import Clinic from '../../container-allotment/shared/clinic.model';
import { DonationStatus } from '../../shared/enums/dontainer-status.enum';
import ContainerType from './container-type.model';
import DonationProduct from './donation-product.model';

export default class Donation {
  id: number = 0;
  clinicId: number;
  packageType: number;
  containerTypeId?: number;
  fedexPackagingTypeId?: number;
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

  constructor(
    clinicId: number,
    packageType: number,
    products: DonationProduct[],
    containerTypeId?: number,
    fedexPackagingTypeId?: number,
    trackingNumber?: string
  ) {
    this.clinicId = clinicId;
    this.packageType = packageType;
    this.products = products;
    this.containerTypeId = containerTypeId;
    this.fedexPackagingTypeId = fedexPackagingTypeId;
    this.trackingNumber = trackingNumber;
  }

  get ProductIds(): number[] {
    return this.products.map((product) => product.productId);
  }
}

import { DonationStatus } from '../../shared/enums/dontainer-status.enum';
import DonationProduct from './donation-product.model';

export default class Donation {
  id: number = 0;
  containerType: number;
  containerId: number;
  length?: number;
  width?: number;
  height?: number;
  productTypes: string[] = [];
  trackingNumber: string = '';
  labelFileName: string = '';
  labelPath?: string;
  createdDate: Date = new Date();
  status: DonationStatus = DonationStatus.Donated;

  products: DonationProduct[];
  container?: Donation; // This will be set later when the container is fetched

  constructor(
    containerType: number,
    containerId: number,
    products: DonationProduct[],
    length: number | undefined = undefined,
    width: number | undefined = undefined,
    height: number | undefined = undefined
  ) {
    this.containerId = containerId;
    this.containerType = containerType;
    this.products = products;
    this.length = length;
    this.width = width;
    this.height = height;
  }

  get ProductIds(): number[] {
    return this.products.map((product) => product.productId);
  }
}

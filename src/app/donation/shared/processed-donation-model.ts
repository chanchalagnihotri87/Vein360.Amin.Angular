import ProcessedProduct from '../../product/shared/processed-product.model';

export default class ProcessedDonation {
  constructor(public donationId: number, public products: ProcessedProduct[]) {}
}

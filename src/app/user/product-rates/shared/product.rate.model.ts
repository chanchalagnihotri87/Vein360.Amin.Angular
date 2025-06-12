export default class ProductRate {
  constructor(
    public productId: number,
    public sellingPrice: number | null = null,
    public buyingPrice: number | null = null,
    public payToSalesCredit: boolean = false,
    public payFromSalesCredit: boolean = false
  ) {}
}

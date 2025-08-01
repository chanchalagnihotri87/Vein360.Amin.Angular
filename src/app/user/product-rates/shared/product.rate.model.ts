export default class ProductRate {
  constructor(
    public productId: number,
    public price: number | null = null,
    public useSalesCredit: boolean = false
  ) {}
}

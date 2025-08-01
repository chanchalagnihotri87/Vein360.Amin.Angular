import { ProductType } from './product-type.enum';
import { TradeType } from './trade-type.enum';

export default class Product {
  public id: number = 0;
  public imageFile?: File = undefined;

  constructor(
    public name: string,
    public type: ProductType,
    public vein360ProductId: string,
    public trade: TradeType,
    public price?: number,
    public image?: string
  ) {}
}

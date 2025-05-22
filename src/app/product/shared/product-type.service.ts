import { Injectable } from '@angular/core';
import ProductTypeListItem from './product-type-list-item.model';
import { ProductType } from './product-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  getProductTypes() {
    return [
      new ProductTypeListItem(
        ProductType.ClosureFastCatheter,
        'Closure Fast Catheter'
      ),
      new ProductTypeListItem(
        ProductType.IntroducerSheath,
        'Introducer Sheath'
      ),
      new ProductTypeListItem(ProductType.IVUSCatheter, 'IVUS Catheter'),
      new ProductTypeListItem(ProductType.ProcedurePack, 'Procedure Pack'),
    ];
  }
}

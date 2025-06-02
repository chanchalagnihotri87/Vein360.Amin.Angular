import { Injectable } from '@angular/core';
import { PackageType } from '../../shared/enums/package-type.enum';

@Injectable({
  providedIn: 'root',
})
export default class PackTypeService {
  public GetPackageTypeDescription(packageType?: number) {
    if (packageType) {
      switch (packageType) {
        case PackageType.CustomPackage:
          return 'Custom Package ';

        case PackageType.Vein360Container:
          return ' Vein360 Container';

        case PackageType.FedexPackage:
          return 'Fedex Package';
      }
    }

    return '';
  }
}

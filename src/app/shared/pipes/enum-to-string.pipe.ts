import { Pipe, PipeTransform } from '@angular/core';
import { DonationContainerStatus } from '../enums/donation-container.status';
import { Vein360ContainerStatus } from '../enums/vein360-container-status';

@Pipe({
  name: 'enumToString',
})
export class EnumToStringPipe implements PipeTransform {
  transform(value: number | undefined, arg: string): string | null {
    if (!value) {
      return null;
    }
    if (arg === 'DonationContainerStatus') {
      return DonationContainerStatus[value];
    } else if (arg === 'Vein360ContainerStatus') {
      return Vein360ContainerStatus[value];
    }
    return null;
  }
}

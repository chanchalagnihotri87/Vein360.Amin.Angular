import { DonationContainerStatus } from '../../shared/enums/donation-container.status';
import ContainerType from './container-type.model';
import Vein360Container from './vein-360-container.model';
import Vein360User from './vien-360-user-model';

export default class DonationContainer {
  constructor(
    public id: number,
    public name: string,
    public containerType: ContainerType,
    public status: DonationContainerStatus,
    public createdDate: Date,
    public container?: Vein360Container,
    public donor?: Vein360User,
    public trackingNumber: string = '',
    public labelFileName: string = ''
  ) {}
}

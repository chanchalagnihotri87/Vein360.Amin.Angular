import { DonationContainerStatus } from '../../shared/enums/donation-container.status';
import Clinic from './clinic.model';
import ContainerType from './container-type.model';
import Vein360User from './vien-360-user-model';

export default class DonationContainer {
  constructor(
    public id: number,
    public name: string,
    public containerType: ContainerType,
    public clinicId: number,
    public status: DonationContainerStatus,
    public createdDate: Date,
    public donor?: Vein360User,
    public requestedUnits: number = 0,
    public approvedUnits?: number,
    public replenishmentOrderId?: number,
    public clinic?: Clinic
  ) {}
}

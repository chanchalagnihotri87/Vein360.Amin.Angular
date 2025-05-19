import { Vein360ContainerStatus } from '../../shared/enums/vein360-container-status';
import ContainerType from './container-type.model';

export default class Vein360Container {
  public id: number = 0;

  public containerType: ContainerType = new ContainerType(0, '', 0);
  constructor(
    public containerTypeId: number,
    public containerCode: string,
    public status: Vein360ContainerStatus = Vein360ContainerStatus.Available
  ) {}
}

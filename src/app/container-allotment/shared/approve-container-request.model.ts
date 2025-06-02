export default class ApproveContainerRequest {
  constructor(
    public donationContainerId: number,
    public approvedUnits: number
  ) {}
}

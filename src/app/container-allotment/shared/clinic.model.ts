export default class Clinic {
  public id?: number;
  public userId?: number;

  constructor(
    public clinicName: string,
    public contactName: string,
    public contactEmail: string,
    public contactPhone: string,
    public addressLine1: string,
    public addressLine2: string,
    public city: string,
    public state: string,
    public country: string,
    public postalCode: string
  ) {}
}

export default class Clinic {
  public id?: number;
  public userId?: number;

  constructor(
    public clinicCode: string,
    public clinicName: string,
    public phone: string,
    public streetLine: string,
    public city: string,
    public state: string,
    public country: string,
    public postalCode: string
  ) {}
}

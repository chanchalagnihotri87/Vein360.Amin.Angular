export default class User {
  constructor(
    public id: number,
    public email: string,
    public isDonor: boolean,
    public isAdmin: boolean
  ) {}
}

export default class User {
  constructor(
    public id: number,
    public username: string,
    public isBuyer: boolean,
    public isDonor: boolean,
    public isAdmin: boolean,
    public isApiUser: boolean
  ) {}
}

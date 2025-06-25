export default class User {
  constructor(
    public id: number,
    public username: string,
    public isDonor: boolean,
    public isAdmin: boolean
  ) {}
}

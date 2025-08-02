export default class CreateUserRequest {
  constructor(
    public username: string,
    public password: string,
    public isBuyer: boolean,
    public isDonor: boolean,
    public isAdmin: boolean,
    public isApiUser: boolean
  ) {}
}

export default class CreateUserRequest {
  constructor(
    public username: string,
    public password: string,
    public isDonor: boolean,
    public isAdmin: boolean
  ) {}
}

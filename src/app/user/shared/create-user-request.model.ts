export default class CreateUserRequest {
  constructor(
    public email: string,
    public password: string,
    public isDonor: boolean,
    public isAdmin: boolean
  ) {}
}

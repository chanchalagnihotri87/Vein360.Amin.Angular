export default class AuthenticationResponse {
  constructor(public token: string, public firstTimeLogin: boolean) {}
}

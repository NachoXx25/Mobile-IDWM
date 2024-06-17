import { User } from "./user";

export class UserLog {
  constructor(
    public user: User,
    public token: string
  ) {}
}

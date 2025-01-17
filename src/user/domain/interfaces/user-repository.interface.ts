import { User } from "../entities/user";
import { UserEmail } from "../value-objects/userEmail";

export interface IUserRepo {
  exists(userEmail: UserEmail) : Promise<boolean>;
  getUserByEmail(userEmail: UserEmail) : Promise<User>;

}
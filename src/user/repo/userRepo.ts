import { User } from "../domain/entities/user";
import { UserEmail } from "../domain/value-objects/userEmail";

export interface IUserRepo {
  exists(userEmail: UserEmail) : Promise<boolean>;
  getUserByEmail(userEmail: UserEmail) : Promise<User>;

}
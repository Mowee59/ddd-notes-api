import { User } from "../entities/user";
import { UserEmail } from "../value-objects/userEmail";
import { UserId } from "../value-objects/userId";

export interface IUserRepo {
  exists(userEmail: UserEmail) : Promise<boolean>;
  getUserByEmail(userEmail: UserEmail) : Promise<User>;
  getUserById(userId: UserId) : Promise<User>;
  save(user: User) : Promise<void>;
}
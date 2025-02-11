import { Injectable } from "@nestjs/common";
import { IUserRepo } from "../../domain/interfaces/user-repository.interface";
import { User } from "src/user/domain/entities/user";
import { UserEmail } from "src/user/domain/value-objects/userEmail";
import { UserPassword } from "src/user/domain/value-objects/userPassword";
  import { UserId } from "src/user/domain/value-objects/userId";


@Injectable()
export class TempUserRepo implements IUserRepo{
  
  users : User[] = [
    User.create({
      email: UserEmail.create('test@test.com').getValue(),
      password: UserPassword.create({ value: 'password', hashed: false }).getValue(),
    }).getValue(),
  ];

  async exists(userEmail: UserEmail): Promise<boolean> {
    return this.users.some((user) => user.props.email.equals(userEmail));
  }

  async getUserByEmail(userEmail: UserEmail): Promise<User> {
    const user = this.users.find((user) => user.props.email.equals(userEmail));
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = this.users.find((user) => user.id.toString() === userId);
    if (!user) {
      return null;
    }
    return user;
  }

  async delete(userId: string): Promise<void> {
    this.users = this.users.filter((user) => user.id.toString() !== userId);
  }

  

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}

import { Injectable, NotImplementedException } from "@nestjs/common";
import { IUserRepo } from "../userRepo";
import { User } from "src/user/domain/entities/user";
import { UserEmail } from "src/user/domain/value-objects/userEmail";
import { UserPassword } from "src/user/domain/value-objects/userPassword";


@Injectable()
export class TempUserRepo implements IUserRepo{
  
  users : User[] = [
    User.create({
      email: UserEmail.create('test@test.com').getValue(),
      password: UserPassword.create({ value: 'password', hashed: false }).getValue(),
      colorPreference: 'light',
      fontPreference: 'sans-serif',
    }).getValue(),
  ];

  exists(userEmail: UserEmail): Promise<boolean> {
    throw new NotImplementedException('qsdqsd');
  }

  async getUserByEmail(userEmail: UserEmail): Promise<User> {
    const user = this.users.find((user) => user.props.email.equals(userEmail));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
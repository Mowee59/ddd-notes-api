import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { UserPassword } from 'src/user/domain/value-objects/userPassword';
import { UserEmail } from 'src/user/domain/value-objects/userEmail';

const users : User[] = [
  User.create({
    email: UserEmail.create('test@test.com').getValue(),
    password: UserPassword.create({ value: 'password', hashed: false }).getValue(),
    colorPreference: 'light',
    fontPreference: 'sans-serif',
  }).getValue(),
];

@Injectable()
export class GetUserByIdUseCase {

  public async execute(id: string): Promise<User> {
    const user = users.find((user) => user.id.equals(new UniqueEntityID(id)));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

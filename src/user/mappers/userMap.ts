import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { User } from '../domain/entities/user';
import { UserEmail } from '../domain/value-objects/userEmail';
import { UserPassword } from '../domain/value-objects/userPassword';
import { Result } from 'src/shared/core/Result';

//Todo create a Mapper interface
export class UserMap {
  public static toDomain(raw: any): User {
    const userEmailOrError = UserEmail.create(raw.email);
    const passwordOrError = UserPassword.create({ value: raw.password });

    const userOrError = User.create(
      {
        email: userEmailOrError.getValue(),
        password: passwordOrError.getValue(),
        colorPreference: raw.colorPreference,
        fontPreference: raw.fontPreference,
      },
      new UniqueEntityID(raw.id),
    );

    if (userOrError.isFailure) {
      console.log(userOrError.getErrorValue());
      return null;
    } else if (userOrError.isSuccess) {
      return userOrError.getValue();
    }
  }
}

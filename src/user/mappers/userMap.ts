import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { User } from '../domain/entities/user';
import { UserEmail } from '../domain/value-objects/userEmail';
import { UserPassword } from '../domain/value-objects/userPassword';
import { Result } from 'src/shared/core/Result';

//Todo create a Mapper interface
export class UserMap {
  public static toDomain(raw: any): User {
    const userEmailOrError = UserEmail.create(raw.user_email);
    const passwordOrError = UserPassword.create({ value: raw.user_password, hashed: true });

    const userOrError = User.create(
      {
        email: userEmailOrError.getValue(),
        password: passwordOrError.getValue(),

      },
      new UniqueEntityID(raw.base_user_id),
    );

    if (userOrError.isFailure) {
      console.log(userOrError.getErrorValue());
      return null;
    } else if (userOrError.isSuccess) {
      return userOrError.getValue();
    }
  }

 
  public static async toPersistence(user: User): Promise<any> {
    let password: string = null;
    let hashedPassword: string = null;

    if (user.password) {
     hashedPassword = user.password.isAlreadyHashed()
        ? user.password.value
        : await user.password.getHashedValue();
    }

    return {
      base_user_id: user.id.toString(),
      user_email: user.props.email.value,
      user_password: hashedPassword,
    };
  }
  

}

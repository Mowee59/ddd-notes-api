import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Guard } from 'src/shared/core/Guard';
import { UserEmail } from '../value-objects/userEmail';
import { UserPassword } from '../value-objects/userPassword';
import { Result } from 'src/shared/core/Result';
import { AggregateRoot } from 'src/shared/domain/AggrehateRoot';

interface UserProps {
  email: UserEmail;
  password: UserPassword;
  colorPreference: 'light' | 'dark' | 'system';
  fontPreference: 'sans-serif' | 'serif' | 'monospace';
}

export class User extends AggregateRoot<UserProps> {
  constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefined(props.email, 'email');

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
        colorPreference: props.colorPreference || 'system', 
        fontPreference: props.fontPreference || 'sans-serif',
      },
      id,
    );

    // if (isNewUser) {
    //   user.addDomainEvent(new UserCreated(user));
    // }

    return Result.ok<User>(user);
  }
}

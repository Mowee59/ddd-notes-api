import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Guard } from 'src/shared/core/Guard';
import { UserEmail } from '../value-objects/userEmail';
import { UserPassword } from '../value-objects/userPassword';
import { Result } from 'src/shared/core/Result';
import { AggregateRoot } from 'src/shared/domain/AggrehateRoot';
import { UserId } from '../value-objects/userId';

// TODO : add is email verified
interface UserProps {
  email: UserEmail;
  password: UserPassword;
  accessToken?: string;
  refreshToken?: string;  
}

export class User extends AggregateRoot<UserProps> {
  constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get userId(): UserId {
    return UserId.create(this._id)
      .getValue();
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  public isLoggedIn (): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefined(props.email, 'email');

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props
      },
      id,
    );

    // if (isNewUser) {
    //   user.addDomainEvent(new UserCreated(user));
    // }

    return Result.ok<User>(user);
  }
}

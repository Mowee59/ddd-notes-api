import bcrypt from 'bcrypt';
import { ValueObject } from '../../../shared/domain/ValueObject';
import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';

export interface IUserPassword {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPassword> {
  public static minLength = 8;

  get value() {
    return this.props.value;
  }
  private constructor(props: IUserPassword) {
    super(props);
  }

  /**
   * Compares a plain text string with a hashed string using bcrypt
   * @param plainText - The plain text string to compare
   * @param hashed - The hashed string to compare against
   * @returns Promise that resolves to true if strings match, false otherwise
   * @private
   */
  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      });
    });
  }

  /**
   * Compares a plain text password with the stored password value
   * If the stored password is hashed, uses bcrypt comparison
   * If not hashed, does direct string comparison
   * @param plainTextPassword - The plain text password to compare
   * @returns Promise that resolves to true if passwords match, false otherwise
   */
  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  }

  public static create(props: IUserPassword): Result<UserPassword> {
    const propsResult = Guard.againstNullOrUndefined(props.value, 'password');

    if (propsResult.isFailure) {
      return Result.fail<UserPassword>(propsResult.getErrorValue());
    } else {
      if (!props.hashed) {
        if (!this.isAppropriateLength(props.value)) {
          return Result.fail<UserPassword>(
            'Password doesnt meet criteria [8 chars min].',
          );
        }
      }

      return Result.ok<UserPassword>(
        new UserPassword({
          value: props.value,
          hashed: !!props.hashed === true,
        }),
      );
    }
  }
}

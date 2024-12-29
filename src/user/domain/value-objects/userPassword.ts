import bcrypt from 'bcrypt';
import { ValueObject } from '../../../shared/domain/ValueObject';
import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';

export interface IUserPassword {
  value: string;
  hashed: boolean;
}

export class UserPassword extends ValueObject<IUserPassword> {
  public static minLength = 8;

  get value() {
    return this.props.value;
  }
  private constructor(props: IUserPassword) {
    super(props);
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

  
}

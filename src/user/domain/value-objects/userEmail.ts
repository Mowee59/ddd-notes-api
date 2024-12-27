import { ValueObject } from '../../../shared/domain/ValueObject';
import { Result } from '../../../shared/core/Result';

export interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  private constructor(props: UserEmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  private static format(email: string): string {
    return email.toLowerCase().trim();
  }

  public static create(email: string): Result<UserEmail> {
    if (!this.isValidEmail(email)) {
      return Result.fail('Adresse email non valide');
    }
    return Result.ok(new UserEmail({ value: this.format(email) }));
  }
}

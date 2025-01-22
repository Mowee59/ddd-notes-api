import { Expose } from "class-transformer";
import { LoginDTO } from "../../../application/use-cases/login/login-dto";
import { IsNotEmpty } from "class-validator";

export class LoginRequestDTO implements LoginDTO {

  @Expose()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsNotEmpty()
  password: string;
}

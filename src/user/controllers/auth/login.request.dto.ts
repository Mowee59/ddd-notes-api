import { Expose } from "class-transformer";
import { LoginDTO } from "src/user/application/use-cases/login/login-dto";
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDTO implements LoginDTO {

  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com'
  })
  email: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password'
  })
  password: string;
}

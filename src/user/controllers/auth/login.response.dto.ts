import { ApiProperty } from '@nestjs/swagger'; 
import { LoginDTOResponse } from 'src/user/application/use-cases/login/login-dto-response';

export class LoginResponseDTO implements LoginDTOResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the authenticated user',
  })
  userEmail: string;
}
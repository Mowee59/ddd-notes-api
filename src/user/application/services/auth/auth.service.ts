import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTClaims, JWTToken } from '../../../domain/interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signJWT(payload: JWTClaims): Promise<JWTToken> {
    return this.jwtService.signAsync(payload);
  }

  // TODO: Implement refresh token method

  
}

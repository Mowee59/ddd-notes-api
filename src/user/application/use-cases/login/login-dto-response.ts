import { JWTToken } from '../../../domain/interfaces/jwt.interface';

export interface LoginDTOResponse {
  accessToken: JWTToken;
  userEmail: string;
}

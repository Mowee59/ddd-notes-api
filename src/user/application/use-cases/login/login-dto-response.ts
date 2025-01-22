import { JWTToken } from '../../../domain/interfaces/jwt.interface';

// TODO: Use classe like login dto ?
export interface LoginDTOResponse {
  accessToken: JWTToken;
  userEmail: string;
}

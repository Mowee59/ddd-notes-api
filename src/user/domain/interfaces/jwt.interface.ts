export interface JWTClaims {
  sub: string;
  email: string;
}

export type JWTToken = string;

export type RefreshToken = string;

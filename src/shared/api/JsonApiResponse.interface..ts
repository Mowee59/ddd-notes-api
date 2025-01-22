import { Response } from 'express';

export interface JsonApiResponse<T> extends Response {
  data?: {
    status: string;
    type: string;
    id?: string;
    attributes: T;
  };
    error?: {
    status: string;
    message: string;
  };
}



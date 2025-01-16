import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/core/UseCase';
import { LoginDTO } from './login-dto';
import { IUserRepo } from 'src/user/repo/userRepo';


@Injectable()
export class LoginUseCase implements UseCase<LoginDTO, any>{
 
  constructor(@Inject('IUserRepo') private readonly userRepo: IUserRepo){} 

 async execute(request: LoginDTO) {
  return null;
 }
}

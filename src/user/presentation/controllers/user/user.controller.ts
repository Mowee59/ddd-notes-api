import { Controller, Param, Delete, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseInterceptor } from 'src/shared/infrastructure/interceptors/response.interceptor';
import { DeleteUserUseCaseErrors } from 'src/user/application/use-cases/delete-user/delete-user.error';
import { DeleteUserUseCase } from 'src/user/application/use-cases/delete-user/delete-user.usecase';

@Controller('user')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  // TODO : Use DTOS for param and validation pipes
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const result = await this.deleteUserUseCase.execute({ userId: id });
    if (result.isLeft()) {
     const error = result.value;
     let statusCode: HttpStatus;

     switch (error.constructor) {
      case DeleteUserUseCaseErrors.UserNotFoundError:
        statusCode = HttpStatus.NOT_FOUND;
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
     }

     throw new HttpException(error.getErrorValue().message, statusCode);
  }

  // TODO : is returning null if succes ( CQRS ), see if i need to return id

  return ;
  }
}
import { Controller, Param, Delete, UseInterceptors, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from 'src/shared/infrastructure/interceptors/response.interceptor';
import { DeleteUserUseCaseErrors } from 'src/user/application/use-cases/delete-user/delete-user.error';
import { DeleteUserUseCase } from 'src/user/application/use-cases/delete-user/delete-user.usecase';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteUserRequestDTO } from './delete-user.request.dto';

@Controller('user')
@ApiTags('User Management')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'user' },
        
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'error' },
        error: {
          type: 'object',
          properties: {
            status: { type: 'number', example: 404 },
            message: { type: 'string', example: 'User not found' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'error' },
        error: {
          type: 'object',
          properties: {
            status: { type: 'number', example: 500 },
            message: { type: 'string', example: 'An unexpected error occurred' }
          }
        }
      }
    }
  })
  async deleteUser(@Param(ValidationPipe) params: DeleteUserRequestDTO) {
    const result = await this.deleteUserUseCase.execute({ userId: params.userId });
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
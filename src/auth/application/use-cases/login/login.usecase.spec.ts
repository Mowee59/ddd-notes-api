import { TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.usecase';
import { IUserRepo } from 'src/user/domain/interfaces/user-repository.interface';
import { LoginUseCaseErrors } from './login-errors';
import { User } from 'src/user/domain/entities/user';
import { LoginDTO } from 'src/auth/application/use-cases/login/login-dto';
import { Test } from '@nestjs/testing';
import { UserEmail } from 'src/user/domain/value-objects/userEmail';
import { UserPassword } from 'src/user/domain/value-objects/userPassword';
import { Result } from 'src/shared/core/Result';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepo: jest.Mocked<IUserRepo>;

  beforeEach(async () => {
    mockUserRepo = {
      getUserByEmail: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: 'IUserRepo', useValue: mockUserRepo },
      ],
    }).compile();

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('should be defined', () => {
    expect(loginUseCase).toBeDefined();
  });

  it('should return UserNotFoundError if user is not found', async () => {
    // Arrange
    const loginDto: LoginDTO = {
      email: 'test@example.com',
      password: 'password',
    };
    mockUserRepo.getUserByEmail.mockResolvedValue(null);

    // Act
    const response = await loginUseCase.execute(loginDto);

    // Assert
    expect(response.isLeft()).toBe(true);
    expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith(
      UserEmail.create(loginDto.email).getValue(),
    );
    expect(response.value).toBeInstanceOf(LoginUseCaseErrors.UserNotFoundError);
  });

  it('should return InvalidCredentialsError email has invalid format  ', async () => {
    const loginDto: LoginDTO = {
      email: 'InvalidEmail',
      password: 'password',
    };

    const response = await loginUseCase.execute(loginDto);

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(
      LoginUseCaseErrors.InvalidCredentialsError,
    );
  });

  it('should return InvalidCredentialsError if password has invalid format', async () => {
    const loginDto: LoginDTO = {
      email: 'test@example.com',
      password: '',
    };

    const response = await loginUseCase.execute(loginDto);

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(
      LoginUseCaseErrors.InvalidCredentialsError,
    );
  });

  test.each([
    {
      email: 'InvalidEmail',
      password: 'password',
      description: 'invalid email format',
    },
    {
      email: 'test@example.com',
      password: '',
      description: 'invalid password format',
    },
    {
      email: 'InvalidEmail',
      password: '',
      description: 'both email and password invalid',
    },
  ])(
    'should return InvalidCredentialsError if $description',
    async ({ email, password }) => {
      const loginDto: LoginDTO = { email, password };

      const response = await loginUseCase.execute(loginDto);

      expect(response.isLeft()).toBe(true);
      expect(response.value).toBeInstanceOf(
        LoginUseCaseErrors.InvalidCredentialsError,
      );
    },
  );

  it('should return user if email and password are valid', async () => {
    const loginDto: LoginDTO = {
      email: 'test@example.com',
      password: 'password',
    };

    const user = User.create({
      email: UserEmail.create(loginDto.email).getValue(),
      password: UserPassword.create({ value: loginDto.password }).getValue(),
    }).getValue();

    user.password.comparePassword = jest.fn().mockResolvedValue(true);

    mockUserRepo.getUserByEmail.mockResolvedValue(user);

    const response = await loginUseCase.execute(loginDto);

    expect(response.isRight()).toBe(true);
    expect(response.value).toBeInstanceOf(User);

    expect(response.value).toBe(user);
  });
});

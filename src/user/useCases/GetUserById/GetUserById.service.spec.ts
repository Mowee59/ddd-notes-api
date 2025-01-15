import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByIdUseCase } from './GetUserById.service';

describe('GetUserByIdService', () => {
  let service: GetUserByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetUserByIdUseCase],
    }).compile();

    service = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

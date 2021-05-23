import { Test, TestingModule } from '@nestjs/testing';
import { FileResourceController } from './file-resource.controller';
import { FileResourceService } from './file-resource.service';

describe('FileResourceController', () => {
  let controller: FileResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileResourceController],
      providers: [FileResourceService],
    }).compile();

    controller = module.get<FileResourceController>(FileResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

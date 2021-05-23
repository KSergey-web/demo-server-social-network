import { Test, TestingModule } from '@nestjs/testing';
import { FileResourceService } from './file-resource.service';

describe('FileResourceService', () => {
  let service: FileResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileResourceService],
    }).compile();

    service = module.get<FileResourceService>(FileResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UpdateUserDTO } from './dto/user.dto';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reg', async () => {
    let p = await service.create({
      login: 'username',
      password: 'password',
    });
    expect(p).toBeDefined();
  });

  it('should update', async () => {
    let userDto: UpdateUserDTO = {
      login: "loginn"
    }
    let p: UserDocument= await service.findByPayload({login:"loginnn"});
    let res = await service.updateUser(userDto,p);
    expect(p).toBeDefined();
  });
});

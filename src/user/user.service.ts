import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
import { LoginDTO, RegisterDTO, UpdateUserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { consoleOut } from '../debug';
import { SocketService } from 'src/socket/socket.service';
import { userStatusEnum } from 'src/socket/enums/socket.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => SocketService))
    private socketService: SocketService,
  ) {}

  async create(userDTO: RegisterDTO) {
    const { login } = userDTO;
    const user = await this.userModel.findOne({ login });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByLogin(userDTO: LoginDTO) {
    const { login, password } = userDTO;
    const user = await this.userModel.findOne({ login });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByPayload(payload: any) {
    //используется для получения пользователя в JWTStrategy
    const { login } = payload;
    return this.sanitizeUser(await this.userModel.findOne({ login }));
  }

  // TODO this method is for development only, remove later
  async findAll() {
    return await this.userModel.find().exec();
  }

  sanitizeUser(user: UserDocument) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async checkUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async updateUser(
    userDTO: UpdateUserDTO,
    user: UserDocument,
  ): Promise<string> {
    await (await this.userModel.findOne(user)).updateOne(userDTO);
    return 'User updated';
  }

  async checkByLogin(login: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ login });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  getStatusUser(userId: string): string {
    if (this.socketService.getClient(userId)) {
      return userStatusEnum.online;
    } else return userStatusEnum.offline;
  }
}

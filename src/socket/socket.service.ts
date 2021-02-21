import { Injectable } from '@nestjs/common';
import { CreateSocketDto } from './dto/create-socket.dto';

@Injectable()
export class SocketService {
  create(createSocketDto: CreateSocketDto) {
    return 'This action adds a new socket';
  }

}

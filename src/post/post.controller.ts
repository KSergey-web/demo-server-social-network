import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { CreatePostDTO } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //Добавить куки с организацией

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() createPostDTO: CreatePostDTO,
    @User() { _id }: UserDocument,
  ) {
    return this.postService.createPost(createPostDTO, _id);
  }

  @ApiBearerAuth()
  @Delete('id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
  ) {
    return this.postService.deletePost(params.id, _id);
  }

  @ApiBearerAuth()
  @Get('id')
  @UseGuards(JwtAuthGuard)
  async getPosts(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    return this.postService.getPosts(params.id, _id);
  }
}

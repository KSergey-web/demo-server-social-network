import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { consoleOut } from 'src/debug';
import { FileResourceService } from 'src/file-resource/file-resource.service';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { CreatePostDTO } from './dto/post.dto';
import { PostService } from './post.service';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly fileResourceService: FileResourceService
    ) {}

  //Добавить куки с организацией

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createPost(
    @Body() createPostDTO: CreatePostDTO,
    @User() { _id }: UserDocument,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const resFiles = await this.fileResourceService.saveFiles(files);
    createPostDTO.files = resFiles.map(((resFile): string => resFile!._id))
    const post = await  this.postService.createPost(createPostDTO, _id);
    post.files.map((file:any) => file.toObject())
    const filesAndBuffers = await this.fileResourceService.getFilesIfImage(post.files);
    const res = post.toObject();
    res.files = filesAndBuffers;
    return res;
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
  ) {
    return this.postService.deletePost(params.id, _id);
  }

  @ApiBearerAuth()
  @Get('all/group/:id')
  @UseGuards(JwtAuthGuard)
  async getPosts(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    const posts = await this.postService.getPosts(params.id, _id);
    let res = [];
    let filesAndBuffers;
    for (let i = 0; i < posts.length; ++i){
      filesAndBuffers = await this.fileResourceService.getFilesIfImage(posts[i].files);
      res.push(posts[i].toObject());
      res[i].files = filesAndBuffers;
    }
    return res;
  }
}

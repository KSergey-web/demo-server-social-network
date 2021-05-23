import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { GroupModule } from 'src/group/group.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { FileResourceModule } from 'src/file-resource/file-resource.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    GroupModule,
    OrganizationModule,
    FileResourceModule
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

import { Module } from '@nestjs/common';
import { FileResourceService } from './file-resource.service';
import { FileResourceController } from './file-resource.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileResource, FileResourceSchema } from './schemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileResource.name, schema: FileResourceSchema },
    ]),
  ],
  controllers: [FileResourceController],
  providers: [FileResourceService],
  exports: [FileResourceService],
})
export class FileResourceModule {}

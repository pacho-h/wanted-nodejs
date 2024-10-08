import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { KeywordNotificationsModule } from '../keyword-notifications/keyword-notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), KeywordNotificationsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

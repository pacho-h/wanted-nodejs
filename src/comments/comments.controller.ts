import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { KeywordNotificationsService } from '../keyword-notifications/keyword-notifications.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly keywordNotificationsService: KeywordNotificationsService,
  ) {}

  @Post()
  async create(
    @Body()
    createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentsService.create(createCommentDto);
    await this.keywordNotificationsService.checkForKeywords(comment.content);
    return comment;
  }

  @Get()
  async getList(
    @Query('postId')
    postId: string,
    @Query('page')
    page?: string,
    @Query('limit')
    limit?: string,
  ) {
    const comments = await this.commentsService.findByPostId(
      +postId,
      page ? +page : 1,
      limit ? +limit : 10,
    );

    return Promise.all(
      comments.map((comment) => {
        return this.commentsService.findReplies(comment.id);
      }),
    ).then((results) => {
      return comments.map((comment, index) => {
        return {
          ...comment,
          replies: results[index],
        };
      });
    });
  }
}

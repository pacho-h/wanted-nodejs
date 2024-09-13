import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  async getList(
    @Query('postId') postId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
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

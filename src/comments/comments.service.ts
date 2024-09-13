import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const newComment = this.commentsRepository.create(createCommentDto);

    newComment.post = await this.postsService.findOne(createCommentDto.postId);
    newComment.createdAt = new Date();
    newComment.updatedAt = new Date();
    return this.commentsRepository.save(newComment);
  }

  findByPostId(postId: number, page: number, limit: number) {
    return this.commentsRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: { post: { id: postId }, commentId: IsNull() },
      order: { createdAt: 'ASC' },
    });
  }

  findReplies(commentId: number) {
    return this.commentsRepository.find({
      where: { commentId },
      order: { createdAt: 'ASC' },
    });
  }
}

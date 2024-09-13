import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  getList(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.postsService.findAll(page ? +page : 1, limit ? +limit : 10);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const post = await this.postsService.findOne(+id);
    this.validatePassword(updatePostDto.password, post.password);
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string, @Body() deletePostDto: DeletePostDto) {
    const post = await this.postsService.findOne(+id);
    this.validatePassword(deletePostDto.password, post.password);
    await this.postsService.delete(+id);
  }

  validatePassword(input: string, target: string) {
    if (input !== target) {
      throw new UnauthorizedException(`Unauthorized`);
    }
  }
}

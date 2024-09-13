import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsInt()
  @IsOptional()
  commentId?: number;
}

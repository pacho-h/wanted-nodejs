import { IsString, IsNotEmpty } from 'class-validator';
import { IsMatchedTo } from '../../validators/match.decorator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsMatchedTo('password', {
    message: 'passwordConfirmation does not match password',
  })
  passwordConfirmation: string;
}

import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { PostsService } from '../posts/posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentsRepository: Repository<Comment>;
  let postsService: PostsService;

  const mockCommentsRepository = {
    create: jest.fn().mockImplementation((dto) => ({
      id: Date.now(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    save: jest.fn().mockResolvedValue({
      id: 1,
      author: 'Test Author',
      content: 'Test Content',
      postId: 1,
      commentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        author: 'Author 1',
        content: 'Comment 1',
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  };

  const mockPostsService = {
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'Test Author',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentsRepository,
        },
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        author: 'Test Author',
        content: 'Test Content',
        postId: 1,
        commentId: null,
      };

      const result = await service.create(createCommentDto);

      expect(postsService.findOne).toHaveBeenCalledWith(1);
      expect(commentsRepository.create).toHaveBeenCalledWith(createCommentDto);
      expect(commentsRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: expect.any(Number),
        author: 'Test Author',
        content: 'Test Content',
        postId: 1,
        commentId: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findByPostId', () => {
    it('should return comments for a given postId', async () => {
      const result = await service.findByPostId(1, 1, 10);

      expect(commentsRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: expect.objectContaining({
          post: { id: 1 },
          commentId: expect.objectContaining({ _type: 'isNull' }),
        }),
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual([
        {
          id: 1,
          author: 'Author 1',
          content: 'Comment 1',
          postId: 1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });
  });

  describe('findReplies', () => {
    it('should return replies for a given commentId', async () => {
      const result = await service.findReplies(1);

      expect(commentsRepository.find).toHaveBeenCalledWith({
        where: { commentId: 1 },
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual([
        {
          id: 1,
          author: 'Author 1',
          content: 'Comment 1',
          postId: 1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn((dto) => ({
      id: Date.now(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findByPostId: jest.fn(() => [
      {
        id: 1,
        author: 'Author 1',
        content: 'Comment 1',
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    findReplies: jest.fn(() => [
      {
        id: 2,
        author: 'Author 2',
        content: 'Reply to Comment 1',
        postId: 1,
        commentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        author: 'Test Author',
        content: 'Test Comment',
        postId: 1,
        commentId: null,
      };

      const result = await controller.create(createCommentDto);

      expect(service.create).toHaveBeenCalledWith(createCommentDto);
      expect(result).toEqual({
        id: expect.any(Number),
        author: 'Test Author',
        content: 'Test Comment',
        postId: 1,
        commentId: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('getList', () => {
    it('should return a list of comments with their replies', async () => {
      const result = await controller.getList('1', '1', '10');

      expect(service.findByPostId).toHaveBeenCalledWith(1, 1, 10);
      expect(service.findReplies).toHaveBeenCalledWith(1);

      expect(result).toEqual([
        {
          id: 1,
          author: 'Author 1',
          content: 'Comment 1',
          postId: 1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          replies: [
            {
              id: 2,
              author: 'Author 2',
              content: 'Reply to Comment 1',
              postId: 1,
              commentId: 1,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
          ],
        },
      ]);
    });
  });
});

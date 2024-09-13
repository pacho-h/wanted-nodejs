import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'Test Author',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPostsService = {
    create: jest.fn().mockResolvedValue(mockPost),
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
    update: jest.fn().mockResolvedValue(mockPost),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
        author: 'Test Author',
        password: 'password',
        passwordConfirmation: 'password',
      };

      const result = await controller.create(createPostDto);
      expect(result).toEqual(mockPost);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('getList', () => {
    it('should return a list of posts', async () => {
      const result = await controller.getList('', '1', '10');
      expect(result).toEqual([mockPost]);
      expect(service.findAll).toHaveBeenCalledWith('', 1, 10);
    });
  });

  describe('get', () => {
    it('should return a single post', async () => {
      const result = await controller.get('1');
      expect(result).toEqual(mockPost);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'Updated Content',
        author: 'Updated Author',
        password: 'password',
      };

      await controller.update('1', updatePostDto);
      expect(service.update).toHaveBeenCalledWith(1, updatePostDto);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const deletePostDto: DeletePostDto = {
        password: 'password',
      };

      const result = await controller.delete('1', deletePostDto);
      expect(service.delete).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});

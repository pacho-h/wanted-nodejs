import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repository: Repository<Post>;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'Test Author',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockPost),
    save: jest.fn().mockResolvedValue(mockPost),
    find: jest.fn().mockResolvedValue([mockPost]),
    findOneOrFail: jest.fn().mockResolvedValue(mockPost),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const result = await service.create(createPostDto);
      expect(result).toEqual(mockPost);
      expect(repository.create).toHaveBeenCalledWith(createPostDto);
      expect(repository.save).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await service.findAll('', 1, 10);
      expect(result).toEqual([mockPost]);
      expect(repository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: [{ title: '' }, { author: '' }],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockPost);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a NotFoundException if post is not found', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        author: 'Updated Author',
        password: 'new-password',
      };

      const result = await service.update(1, updatePostDto);
      expect(result).toEqual(mockPost);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a post by id', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});

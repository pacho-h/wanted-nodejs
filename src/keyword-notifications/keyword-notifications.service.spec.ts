import { Test, TestingModule } from '@nestjs/testing';
import { KeywordNotificationsService } from './keyword-notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeywordNotification } from './entities/keyword-notification.entity';

describe('KeywordNotificationsService', () => {
  let service: KeywordNotificationsService;
  let repository: Repository<KeywordNotification>;

  const mockKeywordNotifications: any = [
    { keyword: 'NestJS', author: 'Author1' },
    { keyword: 'TypeORM', author: 'Author2' },
    { keyword: 'Database', author: 'Author3' },
  ];

  const mockKeywordNotificationsRepository = {
    find: jest.fn().mockResolvedValue(mockKeywordNotifications),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordNotificationsService,
        {
          provide: getRepositoryToken(KeywordNotification),
          useValue: mockKeywordNotificationsRepository,
        },
      ],
    }).compile();

    service = module.get<KeywordNotificationsService>(
      KeywordNotificationsService,
    );
    repository = module.get<Repository<KeywordNotification>>(
      getRepositoryToken(KeywordNotification),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkForKeywords', () => {
    it('should notify when keyword is found in content', async () => {
      const content = 'NestJS is a progressive Node.js framework.';
      const notifySpy = jest.spyOn(service, 'notify').mockResolvedValue();

      await service.checkForKeywords(content);

      expect(repository.find).toHaveBeenCalled();
      expect(notifySpy).toHaveBeenCalledWith(mockKeywordNotifications[0]);
      expect(notifySpy).toHaveBeenCalledTimes(1);
    });

    it('should not notify when no keyword is found in content', async () => {
      const content = 'React is a popular frontend library.';
      const notifySpy = jest.spyOn(service, 'notify').mockResolvedValue();

      await service.checkForKeywords(content);

      expect(repository.find).toHaveBeenCalled();
      expect(notifySpy).not.toHaveBeenCalled();
    });
  });

  describe('notify', () => {
    it('should log the notification message', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const keywordNotification = mockKeywordNotifications[0];

      await service.notify(keywordNotification);

      expect(consoleSpy).toHaveBeenCalledWith(
        `notify to ${keywordNotification.author} - keyword: ${keywordNotification.keyword}`,
      );
    });
  });
});

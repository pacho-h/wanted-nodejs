import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeywordNotification } from './entities/keyword-notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeywordNotificationsService {
  constructor(
    @InjectRepository(KeywordNotification)
    private keywordNotificationsRepository: Repository<KeywordNotification>,
  ) {}

  async checkForKeywords(content: string): Promise<void> {
    const keywordNotifications =
      await this.keywordNotificationsRepository.find();
    const notificationTargets = keywordNotifications.filter(
      (keywordNotification) => content.includes(keywordNotification.keyword),
    );

    Promise.all(
      notificationTargets.map((notificationTarget) => {
        return this.notify(notificationTarget);
      }),
    ).then((results) => {
      console.log(results);
    });
  }

  async notify(keywordNotification: KeywordNotification) {
    // notify to author
    console.log(
      `notify to ${keywordNotification.author} - keyword: ${keywordNotification.keyword}`,
    );
  }
}

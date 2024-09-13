import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordNotification } from './entities/keyword-notification.entity';
import { KeywordNotificationsService } from './keyword-notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([KeywordNotification])],
  controllers: [],
  providers: [KeywordNotificationsService],
  exports: [KeywordNotificationsService],
})
export class KeywordNotificationsModule {}

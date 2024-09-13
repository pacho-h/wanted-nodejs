import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

export const createTestingModule = async () => {
  const configService = new ConfigService();
  configService.set('STAGE', 'testing');

  return await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
};

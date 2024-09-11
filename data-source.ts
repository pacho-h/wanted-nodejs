import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { TypeOrmConfigService } from './src/config/typeorm.config';

config();

const configService = new ConfigService();
const typeOrmConfigService = new TypeOrmConfigService(configService);

export const AppDataSource = new DataSource(
  <DataSourceOptions>typeOrmConfigService.createTypeOrmOptions(),
);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

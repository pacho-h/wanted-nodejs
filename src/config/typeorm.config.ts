import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [__dirname + '/../**/entities/*.entity.{js,ts}'],
      migrations: [__dirname + '/../migrations/*.{js,ts}'],
      synchronize: false,
    };
  }
}

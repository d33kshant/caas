import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { CompressionModule } from './compression/compression.module';
import { BullModule } from '@nestjs/bull';
import { REDIS_HOST, REDIS_PASS, REDIS_PORT } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>(REDIS_HOST),
          port: configService.get<number>(REDIS_PORT),
          password: configService.get<string>(REDIS_PASS),
        }
      })
    }),
    FilesModule,
    CompressionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

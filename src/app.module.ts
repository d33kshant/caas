import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { CompressionModule } from './compression/compression.module';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_DEST, REDIS_HOST, REDIS_PASS, REDIS_PORT, STATIC_ROOT } from './constants';
import { join } from 'path';

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
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ([{
        rootPath: join(process.cwd(), configService.get<string>(PUBLIC_DEST)),
        serveRoot: configService.get<string>(STATIC_ROOT),
      }])
    }),
    FilesModule,
    CompressionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

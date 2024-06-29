import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { BullModule } from '@nestjs/bull';
import { FILES_QUEUE, MULTER_DEST } from 'src/constants';
import { FilesProcessor } from './files.processor';
import { CompressionModule } from 'src/compression/compression.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>(MULTER_DEST),
        })
      }),
    }),
    BullModule.registerQueue({
      name: FILES_QUEUE,
    }),
    CompressionModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesProcessor]
})
export class FilesModule {}

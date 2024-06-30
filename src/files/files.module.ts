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
import { randomUUID } from 'crypto';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>(MULTER_DEST),
          filename: function(_, file, callback) {
            const originalname = file.originalname.replaceAll(' ', '_');
            const filename = `${randomUUID()}_${originalname}`;
            callback(null, filename);
          }
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
